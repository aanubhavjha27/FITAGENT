from typing import TypedDict, Annotated, Sequence, Optional
from langchain_core.messages import BaseMessage
import operator

class AgentState(TypedDict):
    messages: Annotated[Sequence[BaseMessage], operator.add]
    user_id: str
    user_profile: Optional[dict]
    current_plan: Optional[dict]
    intent: Optional[str]
    final_response: Optional[str]
    error: Optional[str]