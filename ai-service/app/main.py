from fastapi import FastAPI

app = FastAPI(title="Resale Marketplace AI Service")


@app.get("/health")
def health_check() -> dict[str, str]:
    return {"status": "ok"}