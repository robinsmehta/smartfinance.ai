from flask import Flask, jsonify
from flask_cors import CORS
from dotenv import load_dotenv
import os

load_dotenv()

from routes.chat import chat_bp
from routes.loan import loan_bp
from routes.scam import scam_bp
from routes.savings import savings_bp
from routes.multimodal import multimodal_bp


def create_app() -> Flask:
    app = Flask(__name__)
    CORS(app)

    app.register_blueprint(chat_bp)
    app.register_blueprint(loan_bp)
    app.register_blueprint(scam_bp)
    app.register_blueprint(savings_bp)
    app.register_blueprint(multimodal_bp)

    @app.get("/health")
    def health() -> tuple[dict, int]:  # type: ignore[override]
        return {"status": "ok"}, 200

    return app


app = create_app()


if __name__ == "__main__":
    import os

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=False)
