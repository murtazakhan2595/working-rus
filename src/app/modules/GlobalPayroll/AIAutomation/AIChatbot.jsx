import React, { useState } from "react";
import { Bot, MessageCircle, Send, User, Clock, CheckCircle, AlertCircle, HelpCircle } from "lucide-react";
import { Card } from "components/ui/card";
import { Button } from "components/ui/button";

const AIChatbot = () => {
  const [isTyping, setIsTyping] = useState(false);
  const [messages, setMessages] = useState([
    {
      id: 1,
      type: "bot",
      message: "Hello! I'm your AI payroll assistant. How can I help you today?",
      timestamp: "2025-01-21 10:30:00",
    },
  ]);
  const [newMessage, setNewMessage] = useState("");

  const quickQuestions = [
    {
      question: "How do I process payroll for new employees?",
      category: "Payroll Processing",
    },
    {
      question: "What are the WPS submission requirements?",
      category: "Compliance",
    },
    {
      question: "How to calculate overtime for UAE employees?",
      category: "Calculations",
    },
    {
      question: "What documents are needed for PF registration?",
      category: "Documentation",
    },
    {
      question: "How to handle salary advances?",
      category: "Adjustments",
    },
    {
      question: "What are the tax rates for different countries?",
      category: "Tax Information",
    },
  ];

  const conversationHistory = [
    {
      id: 1,
      user: "John Doe",
      question: "How do I add a new employee to payroll?",
      answer: "To add a new employee to payroll, go to Employee Data Integration > Employee Master Sync. You'll need to provide basic information, salary details, and tax information.",
      timestamp: "2025-01-21 09:15:00",
      category: "Payroll Setup",
    },
    {
      id: 2,
      user: "Sarah Johnson",
      question: "What's the deadline for WPS submission?",
      answer: "WPS SIF files must be submitted by the 15th of each month for the previous month's payroll. Late submissions incur penalties of AED 10,000 per day.",
      timestamp: "2025-01-21 08:30:00",
      category: "Compliance",
    },
    {
      id: 3,
      user: "Mike Wilson",
      question: "How to calculate overtime for weekend work?",
      answer: "Weekend overtime is calculated at 1.5x the regular hourly rate for Saturday and 2x for Sunday. The system automatically applies these rates based on your overtime configuration.",
      timestamp: "2025-01-20 16:45:00",
      category: "Calculations",
    },
  ];

  const chatbotCapabilities = [
    {
      capability: "Payroll Processing",
      description: "Help with payroll setup, processing, and calculations",
      icon: CheckCircle,
      color: "blue",
      examples: ["New employee setup", "Salary calculations", "Deduction processing"],
    },
    {
      capability: "Compliance Support",
      description: "Guidance on statutory requirements and deadlines",
      icon: AlertCircle,
      color: "green",
      examples: ["WPS submission", "Tax filing", "PF compliance"],
    },
    {
      capability: "Calculations",
      description: "Assistance with complex payroll calculations",
      icon: HelpCircle,
      color: "purple",
      examples: ["Overtime calculations", "Tax computations", "Allowance calculations"],
    },
    {
      capability: "Documentation",
      description: "Help with required documents and forms",
      icon: MessageCircle,
      color: "yellow",
      examples: ["Form requirements", "Document templates", "Submission guidelines"],
    },
  ];

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const userMessage = {
      id: messages.length + 1,
      type: "user",
      message: newMessage,
      timestamp: new Date().toLocaleString(),
    };

    setMessages([...messages, userMessage]);
    setNewMessage("");
    setIsTyping(true);

    // Simulate bot response
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        type: "bot",
        message: "I understand your question about payroll. Let me help you with that. Based on your query, I recommend checking the Payroll Setup & Configuration section for detailed guidance.",
        timestamp: new Date().toLocaleString(),
      };
      setMessages(prev => [...prev, botResponse]);
      setIsTyping(false);
    }, 2000);
  };

  const handleQuickQuestion = (question) => {
    setNewMessage(question);
  };

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Conversational AI Bot for Payroll Queries</h1>
          <p className="text-gray-600 mt-1">
            Get instant answers to payroll questions with our AI-powered chatbot
          </p>
        </div>
        <div className="flex gap-3">
          <Button className="bg-blue-600 text-white">
            <Bot className="w-4 h-4 mr-2" />
            Start New Chat
          </Button>
          <Button className="bg-green-600 text-white">
            <MessageCircle className="w-4 h-4 mr-2" />
            View History
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat Interface */}
        <div className="lg:col-span-2">
          <Card className="p-6 bg-white h-96 flex flex-col">
            <div className="flex items-center gap-3 mb-4">
              <Bot className="w-6 h-6 text-blue-600" />
              <h2 className="text-lg font-semibold text-gray-900">AI Payroll Assistant</h2>
              <div className="flex items-center gap-1 ml-auto">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span className="text-xs text-gray-600">Online</span>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto space-y-3 mb-4">
              {messages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs p-3 rounded-lg ${
                    msg.type === 'user' 
                      ? 'bg-blue-600 text-white' 
                      : 'bg-gray-100 text-gray-900'
                  }`}>
                    <p className="text-sm">{msg.message}</p>
                    <p className="text-xs opacity-70 mt-1">{msg.timestamp}</p>
                  </div>
                </div>
              ))}
              
              {isTyping && (
                <div className="flex justify-start">
                  <div className="bg-gray-100 p-3 rounded-lg">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
                      <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Message Input */}
            <div className="flex gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask me anything about payroll..."
                className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <Button
                onClick={handleSendMessage}
                disabled={!newMessage.trim() || isTyping}
                className="bg-blue-600 text-white disabled:bg-gray-300"
              >
                <Send className="w-4 h-4" />
              </Button>
            </div>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Quick Questions */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Questions</h3>
            <div className="space-y-2">
              {quickQuestions.map((q, index) => (
                <Button
                  key={index}
                  onClick={() => handleQuickQuestion(q.question)}
                  className="w-full text-left justify-start bg-gray-50 hover:bg-gray-100 text-gray-700 text-sm p-3 h-auto"
                >
                  <div>
                    <p className="font-medium">{q.question}</p>
                    <p className="text-xs text-gray-500 mt-1">{q.category}</p>
                  </div>
                </Button>
              ))}
            </div>
          </Card>

          {/* Chatbot Capabilities */}
          <Card className="p-6 bg-white">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">What I Can Help With</h3>
            <div className="space-y-3">
              {chatbotCapabilities.map((capability, index) => (
                <div key={index} className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <capability.icon className={`w-4 h-4 text-${capability.color}-600`} />
                    <h4 className="font-semibold text-gray-900 text-sm">{capability.capability}</h4>
                  </div>
                  <p className="text-xs text-gray-600 mb-2">{capability.description}</p>
                  <div className="text-xs text-gray-500">
                    Examples: {capability.examples.join(", ")}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </div>

      {/* Conversation History */}
      <Card className="p-6 bg-white">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Conversations</h2>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100">
              <tr>
                <th className="p-3 text-left">User</th>
                <th className="p-3 text-left">Question</th>
                <th className="p-3 text-left">Answer</th>
                <th className="p-3 text-left">Category</th>
                <th className="p-3 text-left">Timestamp</th>
                <th className="p-3 text-left">Actions</th>
              </tr>
            </thead>
            <tbody>
              {conversationHistory.map((conversation) => (
                <tr key={conversation.id} className="border-b hover:bg-gray-50">
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <span className="font-semibold">{conversation.user}</span>
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-600 max-w-xs">
                    <p className="truncate">{conversation.question}</p>
                  </td>
                  <td className="p-3 text-sm text-gray-600 max-w-xs">
                    <p className="truncate">{conversation.answer}</p>
                  </td>
                  <td className="p-3">
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs font-medium">
                      {conversation.category}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-400" />
                      <span className="text-sm text-gray-600">{conversation.timestamp}</span>
                    </div>
                  </td>
                  <td className="p-3">
                    <div className="flex gap-2">
                      <Button className="text-xs bg-blue-100 hover:bg-blue-200 text-blue-700">
                        View Full
                      </Button>
                      <Button className="text-xs bg-green-100 hover:bg-green-200 text-green-700">
                        Use Answer
                      </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Chatbot Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-6 bg-blue-50 border-blue-200">
          <div className="flex items-center gap-3 mb-2">
            <Bot className="w-6 h-6 text-blue-600" />
            <h3 className="text-sm text-gray-600">Total Queries</h3>
          </div>
          <p className="text-3xl font-bold text-blue-600">1,247</p>
          <p className="text-sm text-gray-600 mt-1">This month</p>
        </Card>

        <Card className="p-6 bg-green-50 border-green-200">
          <div className="flex items-center gap-3 mb-2">
            <CheckCircle className="w-6 h-6 text-green-600" />
            <h3 className="text-sm text-gray-600">Resolved</h3>
          </div>
          <p className="text-3xl font-bold text-green-600">1,198</p>
          <p className="text-sm text-gray-600 mt-1">96% success rate</p>
        </Card>

        <Card className="p-6 bg-yellow-50 border-yellow-200">
          <div className="flex items-center gap-3 mb-2">
            <Clock className="w-6 h-6 text-yellow-600" />
            <h3 className="text-sm text-gray-600">Avg Response</h3>
          </div>
          <p className="text-3xl font-bold text-yellow-600">2.3s</p>
          <p className="text-sm text-gray-600 mt-1">Response time</p>
        </Card>

        <Card className="p-6 bg-purple-50 border-purple-200">
          <div className="flex items-center gap-3 mb-2">
            <User className="w-6 h-6 text-purple-600" />
            <h3 className="text-sm text-gray-600">Active Users</h3>
          </div>
          <p className="text-3xl font-bold text-purple-600">45</p>
          <p className="text-sm text-gray-600 mt-1">This week</p>
        </Card>
      </div>

      {/* AI Features */}
      <Card className="p-6 bg-blue-50 border-blue-200">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">AI Chatbot Features</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Natural Language Processing</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Understands complex payroll queries</li>
              <li>• Context-aware responses</li>
              <li>• Multi-language support</li>
              <li>• Learning from user interactions</li>
              <li>• Personalized recommendations</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900 mb-2">Integration Capabilities</h3>
            <ul className="text-sm text-gray-700 space-y-1">
              <li>• Real-time payroll data access</li>
              <li>• Integration with HR systems</li>
              <li>• Automated task execution</li>
              <li>• Escalation to human agents</li>
              <li>• Knowledge base updates</li>
            </ul>
          </div>
        </div>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button className="bg-blue-600 text-white">
          <Bot className="w-4 h-4 mr-2" />
          Start New Conversation
        </Button>
        <Button className="bg-green-600 text-white">
          <MessageCircle className="w-4 h-4 mr-2" />
          View All History
        </Button>
        <Button className="bg-gray-200 text-gray-700">Train AI Model</Button>
      </div>
    </div>
  );
};

export default AIChatbot;
