import pytest

def test_health_check(client):
    res = client.get("/health")
    assert res.status_code == 200
    assert res.json() == {"status": "ok"}

def test_register_and_login_flow(client):
    user_payload = {
        "email": "testfounder@example.com",
        "password": "securepassword123",
        "name": "Alex Founder"
    }
    
    # 1. Register
    reg_res = client.post("/auth/register", json=user_payload)
    assert reg_res.status_code == 201, reg_res.text
    data = reg_res.json()
    assert "user" in data
    assert data["user"]["email"] == "testfounder@example.com"
    assert "tokens" in data
    assert "access_token" in data["tokens"]
    
    # 2. Duplicate Registration Failure
    dup_res = client.post("/auth/register", json=user_payload)
    assert dup_res.status_code == 400

    # 3. Login
    login_res = client.post("/auth/login", json={
        "email": "testfounder@example.com",
        "password": "securepassword123"
    })
    assert login_res.status_code == 200
    access_token = login_res.json()["tokens"]["access_token"]
    refresh_token = login_res.json()["tokens"]["refresh_token"]

    # 4. Get Current User (/auth/me)
    me_res = client.get("/auth/me", headers={"Authorization": f"Bearer {access_token}"})
    assert me_res.status_code == 200
    assert me_res.json()["email"] == "testfounder@example.com"

    # 5. Refresh Token
    ref_res = client.post("/auth/refresh", json={"refresh_token": refresh_token})
    assert ref_res.status_code == 200
    assert "access_token" in ref_res.json()["tokens"]

    # 6. Unauthorized access without token
    unauth_res = client.get("/auth/me")
    assert unauth_res.status_code == 401
