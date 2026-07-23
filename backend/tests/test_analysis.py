import pytest

@pytest.fixture
def auth_headers(client):
    user_payload = {"email": "analysisuser@example.com", "password": "password123", "name": "Analysis User"}
    reg_res = client.post("/auth/register", json=user_payload)
    token = reg_res.json()["tokens"]["access_token"]
    return {"Authorization": f"Bearer {token}"}

def test_analysis_generation_and_export(client, auth_headers):
    # 1. Create a project
    create_payload = {
        "name": "HealthPilot",
        "idea": "An AI coach for daily personalized workouts and macro tracking",
        "industry": "HealthTech",
        "audience": "Fitness enthusiasts",
        "country": "USA",
        "budget": "5000",
        "team": "1",
        "stage": "Idea",
        "goal": "Launch in 30 days"
    }
    proj_res = client.post("/projects", json=create_payload, headers=auth_headers)
    assert proj_res.status_code == 201
    project_id = proj_res.json()["id"]

    # 2. Trigger AI analysis
    analyze_payload = {
        "idea": "An AI coach for daily personalized workouts and macro tracking",
        "industry": "HealthTech",
        "audience": "Fitness enthusiasts",
        "country": "USA",
        "budget": "5000",
        "team": "1",
        "stage": "Idea",
        "goal": "Launch in 30 days"
    }
    ana_res = client.post(f"/projects/{project_id}/analyze", json=analyze_payload, headers=auth_headers)
    assert ana_res.status_code == 200, ana_res.text
    analysis_data = ana_res.json()
    assert "blueprint_json" in analysis_data
    analysis_id = analysis_data["id"]

    blueprint = analysis_data["blueprint_json"]
    assert "startupNames" in blueprint
    assert "startupScore" in blueprint
    assert "elevatorPitch" in blueprint

    # 3. List analyses for project
    list_ana = client.get(f"/projects/{project_id}/analyses", headers=auth_headers)
    assert list_ana.status_code == 200
    assert len(list_ana.json()) == 1

    # 4. Get single analysis detail
    get_ana = client.get(f"/analyses/{analysis_id}", headers=auth_headers)
    assert get_ana.status_code == 200
    assert get_ana.json()["id"] == analysis_id

    # 5. Export Markdown report
    exp_res = client.get(f"/analyses/{analysis_id}/report?format=md", headers=auth_headers)
    assert exp_res.status_code == 200
    assert "text/markdown" in exp_res.headers["content-type"]
    assert "# " in exp_res.text
    assert "## Problem" in exp_res.text
    assert "## Business Model Canvas" in exp_res.text
