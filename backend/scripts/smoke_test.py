import sys
import json
import httpx

BASE_URL = "http://127.0.0.1:8000"

def run_smoke_test():
    print("[START] Starting AI Startup Co-Founder Smoke Test...")
    with httpx.Client(base_url=BASE_URL, timeout=30.0) as client:
        # 1. Health check
        res = client.get("/health")
        print(f"[1/7] GET /health => {res.status_code} {res.json()}")
        assert res.status_code == 200, "Health check failed"

        # 2. Register
        user_data = {
            "email": "smoketest_user@example.com",
            "password": "smokepassword123",
            "name": "Smoke Tester"
        }
        res = client.post("/auth/register", json=user_data)
        if res.status_code == 400 and "already registered" in res.text:
            print("[2/7] User exists, logging in instead...")
            res = client.post("/auth/login", json={"email": user_data["email"], "password": user_data["password"]})
        
        print(f"[2/7] Auth Response => {res.status_code}")
        assert res.status_code in [200, 201], f"Auth failed: {res.text}"
        tokens = res.json()["tokens"]
        access_token = tokens["access_token"]
        headers = {"Authorization": f"Bearer {access_token}"}

        # 3. GET /auth/me
        res = client.get("/auth/me", headers=headers)
        print(f"[3/7] GET /auth/me => {res.status_code} Email: {res.json()['email']}")
        assert res.status_code == 200

        # 4. POST /projects
        proj_payload = {
            "name": "Smoke Test Startup",
            "idea": "An AI platform for rapid prototype generation",
            "industry": "DeveloperTools",
            "audience": "Developers & Product Managers",
            "country": "United States",
            "budget": "10000",
            "team": "2",
            "stage": "Idea",
            "goal": "Launch beta in 30 days"
        }
        res = client.post("/projects", json=proj_payload, headers=headers)
        print(f"[4/7] POST /projects => {res.status_code} ID: {res.json()['id']}")
        assert res.status_code == 201
        project_id = res.json()["id"]

        # 5. POST /projects/{id}/analyze
        analyze_payload = {
            "idea": proj_payload["idea"],
            "industry": proj_payload["industry"],
            "audience": proj_payload["audience"],
            "country": proj_payload["country"],
            "budget": proj_payload["budget"],
            "team": proj_payload["team"],
            "stage": proj_payload["stage"],
            "goal": proj_payload["goal"]
        }
        res = client.post(f"/projects/{project_id}/analyze", json=analyze_payload, headers=headers)
        print(f"[5/7] POST /projects/{project_id}/analyze => {res.status_code}")
        assert res.status_code == 200
        analysis_id = res.json()["id"]

        # 6. GET /analyses/{id}
        res = client.get(f"/analyses/{analysis_id}", headers=headers)
        print(f"[6/7] GET /analyses/{analysis_id} => {res.status_code}")
        assert res.status_code == 200

        # 7. GET /analyses/{id}/report?format=md
        res = client.get(f"/analyses/{analysis_id}/report?format=md", headers=headers)
        print(f"[7/7] GET /analyses/{analysis_id}/report => {res.status_code} ({len(res.text)} bytes)")
        assert res.status_code == 200
        assert "# " in res.text

    print("\n[SUCCESS] All smoke tests passed successfully!")

if __name__ == "__main__":
    run_smoke_test()
