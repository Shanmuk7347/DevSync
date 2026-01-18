import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from api.services.google_prompt import generate_json

class ExploreOpenSourceView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        language = request.data.get('language', 'JavaScript')
        topic = request.data.get('topic', 'Web Development')
        difficulty = request.data.get('difficulty', 'Beginner')

        os_schema = {
            "type": "OBJECT",
            "properties": {
                "repositories": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "name": {"type": "STRING"},
                            "github_url": {"type": "STRING"},
                            "description": {"type": "STRING"},
                            "readme_summary": {"type": "STRING"},
                            "difficulty": {"type": "STRING"},
                            "how_to_contribute": {
                                "type": "ARRAY",
                                "items": {"type": "STRING"}
                            },
                            "tech_stack": {
                                "type": "ARRAY",
                                "items": {"type": "STRING"}
                            }
                        },
                        "required": ["name", "github_url", "description", "readme_summary", "how_to_contribute", "tech_stack"]
                    }
                }
            },
            "required": ["repositories"]
        }

        system_instruction = """
        You are an Open Source Guide. 
        Your goal is to recommend REAL, EXISTING, and POPULAR GitHub repositories.
        Do not invent projects. Only recommend projects that actually exist and are active.
        Provide valid GitHub URLs.
        """

        prompt = f"""
        Find 5 active open-source projects on GitHub matching these filters:
        - Language: {language}
        - Domain/Topic: {topic}
        - Difficulty Level: {difficulty}

        For each project:
        1. Provide the real GitHub URL.
        2. Summarize the README in few sentences.
        3. List 3 specific steps on how a new contributor can start (e.g., "Look for 'good first issue' label").
        """

        try:
            # 5. Call Gemini
            json_response_string = generate_json(
                prompt=prompt,
                system_instruction=system_instruction,
                response_schema=os_schema
            )

            if not json_response_string:
                return Response({"error": "AI returned empty response"}, status=status.HTTP_502_BAD_GATEWAY)

            data = json.loads(json_response_string)
            return Response(data, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Open Source Search Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)