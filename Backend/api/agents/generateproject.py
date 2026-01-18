import json
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from api.services.google_prompt import generate_json

class GenerateProjectView(APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        skill_level = request.data.get("level", "Beginner")
        project_type = request.data.get("project_type", "For Learning")
        skills = request.data.get('skills', 'Open to suggestions')
        team_size = request.data.get('team_size', 'Solo')
        idea_description = request.data.get('idea_description', 'Not provided')

        system_instruction = """
        You are an AI Project Generator.

        Your job:
        - Generate 3 to 5 project ideas
        - Each project must be realistic for the given skill level and team size
        - Use the provided tech stack where possible
        - Output ONLY valid JSON
        - Do not include explanations, markdown, or extra text

        Each project MUST include:
        - title
        - description
        - core_features (array)
        - implementation_steps (array, high level)
        - what_to_learn (array of skills/topics)
        - difficulty_reason
        """

        project_schema = {
            "type": "OBJECT",
            "properties": {
                "projects": {
                    "type": "ARRAY",
                    "items": {
                        "type": "OBJECT",
                        "properties": {
                            "title": {"type": "STRING"},
                            "description": {"type": "STRING"},
                            "core_features": {
                                "type": "ARRAY",
                                "items": {"type": "STRING"}
                            },
                            "implementation_steps": {
                                "type": "ARRAY", 
                                "items": {"type": "STRING"}
                            },
                            "what_to_learn": {
                                "type": "ARRAY", 
                                "items": {"type": "STRING"}
                            },
                            "difficulty_reason": {"type": "STRING"}
                        },
                        "required": ["title", "description", "core_features", "implementation_steps", "what_to_learn", "difficulty_reason"]
                    }
                }
            },
            "required": ["projects"]
        }

        prompt = f"""
        Generate project ideas based on the following inputs:

        Skill Level: {skill_level}
        Project Type: {project_type}
        Skills: {skills}
        Team Size: {team_size}
        User Idea: {idea_description}

        Follow all rules strictly.
        """

        try:

            json_response_string = generate_json(
                prompt=prompt,
                system_instruction=system_instruction,
                response_schema=project_schema
            )

            if not json_response_string:
                return Response({"error": "AI returned empty response"}, status=status.HTTP_502_BAD_GATEWAY)

            data = json.loads(json_response_string)
            return Response(data, status=status.HTTP_200_OK)

        except json.JSONDecodeError:
            return Response({"error": "AI generated invalid JSON"}, status=status.HTTP_502_BAD_GATEWAY)
        except Exception as e:
            print(f"Generate Project Error: {e}")
            return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)