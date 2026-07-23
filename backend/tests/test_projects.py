import pytest

@pytest.fixture
def auth_headers(client):
    user_payload = {"email": "projectuser@example.com", "password": "password123", "name": "Project User"}
    reg_res = client.post("/auth/register", json=user_payload)
    token = reg_res.json()["tokens"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_project_crud(client, auth_headers):
    # 1. Create project
    create_payload = {
        "name": "FitMind AI",
        "idea": "AI personalized fitness planner",
        "industry": "HealthTech",
        "audience": "Working professionals 22-40",
        "country": "India",
        "budget": "200000",
        "team": "2",
        "stage": "Idea",
        "goal": "Launch within 6 months"
    }
    res = client.post("/projects", json=create_payload, headers=auth_headers)
    assert res.status_code == 201
    project_id = res.json()["id"]
    assert res.json()["name"] == "FitMind AI"

    # 2. Get list of projects
    list_res = client.get("/projects", headers=auth_headers)
    assert list_res.status_code == 200
    assert len(list_res.json()) >= 1

    # 3. Get single project detail
    get_res = client.get(f"/projects/{project_id}", headers=auth_headers)
    assert get_res.status_code == 200
    assert get_res.json()["industry"] == "HealthTech"

    # 4. Patch update project
    patch_res = client.patch(f"/projects/{project_id}", json={"name": "FitMind AI Pro"}, headers=auth_headers)
    assert patch_res.status_code == 200
    assert patch_res.json()["name"] == "FitMind AI Pro"

    # 5. Delete project
    del_res = client.delete(f"/projects/{project_id}", headers=auth_headers)
    assert del_res.status_code == 200
    assert del_res.json() == {"success": True}

    # 6. Verify 404 after deletion
    get_404 = client.get(f"/projects/{project_id}", headers=auth_headers)
    assert get_404.status_code == 404
