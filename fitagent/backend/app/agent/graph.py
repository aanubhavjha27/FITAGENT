from langgraph.graph import StateGraph, END
from app.agent.state import AgentState
from app.agent.nodes import chat_node, generate_plan_node

def create_chat_graph():
    """Graph for chatting with the AI coach."""
    workflow = StateGraph(AgentState)
    workflow.add_node("chat", chat_node)
    workflow.set_entry_point("chat")
    workflow.add_edge("chat", END)
    return workflow.compile()

def create_plan_graph():
    """Graph for generating fitness plan."""
    workflow = StateGraph(AgentState)
    workflow.add_node("generate_plan", generate_plan_node)
    workflow.set_entry_point("generate_plan")
    workflow.add_edge("generate_plan", END)
    return workflow.compile()

chat_graph = create_chat_graph()
plan_graph = create_plan_graph()