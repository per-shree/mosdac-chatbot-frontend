import { useState, useEffect } from "react";
import { supabase } from "./lib/supabaseClient";

function App() {
  const [user, setUser] = useState<any>(null);
  const [messages, setMessages] = useState<{ user: string, bot: string }[]>([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [onboarding, setOnboarding] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data: { user } }) => setUser(user));
    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null);
    });
    return () => listener.subscription.unsubscribe();
  }, []);

  const loginWithGoogle = async () => {
    await supabase.auth.signInWithOAuth({ provider: "google" });
  };
  const loginWithEmail = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const email = (e.target as any).email.value;
    if (email) {
      await supabase.auth.signInWithOtp({ email });
    }
  };
  const logout = async () => {
    await supabase.auth.signOut();
  };

  // Show onboarding the first time after login
  useEffect(() => {
    if (user && !localStorage.getItem("onboarding-done")) {
      setOnboarding(true);
    }
  }, [user]);

  const completeOnboarding = () => {
    setOnboarding(false);
    localStorage.setItem("onboarding-done", "x");
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;
    const userMsg = input;
    setInput("");
    setMessages((prev) => [...prev, { user: userMsg, bot: "..." }]);
    setLoading(true);
    try {
      const res = await fetch("http://localhost:8000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query: userMsg })
      });
      const data = await res.json();
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { user: userMsg, bot: data.answer || "Sorry, no answer found." }
      ]);
    } catch (e) {
      setMessages((prev) => [
        ...prev.slice(0, -1),
        { user: userMsg, bot: "API error." }
      ]);
    }
    setLoading(false);
  };

  if (!user) {
    return (
      <div style={{ maxWidth: 350, margin: "80px auto", border: "1px solid #ddd", borderRadius: 8, padding: 24, fontFamily: 'sans-serif', background: '#fff' }}>
        <h2 style={{ textAlign: "center" }}>Welcome to MOSDAC AI Help Bot</h2>
        <button onClick={loginWithGoogle} style={{ width: '100%', padding:12, borderRadius:4, border: 'none', background: '#23278a', color:'#fff', fontWeight:'bold', marginBottom:12 }}>Login with Google</button>
        <form onSubmit={loginWithEmail} style={{ display:'flex', flexDirection:'column', gap:8 }}>
          <input type="email" name="email" placeholder="Email address" style={{ padding:10,borderRadius:4, border:'1px solid #ccc' }} required />
          <button type="submit" style={{ padding:10, borderRadius:4, border:'none', background: '#007b83', color:'#fff', fontWeight:'bold'}}>Login with Email OTP</button>
        </form>
      </div>
    );
  }

  if (onboarding) {
    return (
      <div style={{ maxWidth: 370, margin: "100px auto", border: "1px solid #ddd", borderRadius: 8, padding: 28, fontFamily: 'sans-serif', background: '#fff', textAlign: 'center' }}>
        <h2>👋 Welcome!</h2>
        <p>This AI bot helps you instantly find any information about MOSDAC's datasets, missions, and portal support.<br/><br/>
        Simply ask a question or browse for guidance. We'll keep your chats for you securely.</p>
        <button onClick={completeOnboarding} style={{ marginTop:24, padding: '10px 36px', borderRadius:4, border:'none', background: '#23278a', color:'#fff', fontWeight:'bold'}}>Start Using Chatbot</button>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: 540, margin: "40px auto", border: "1px solid #ddd", borderRadius: 8, padding: 16, background:'#fff', fontFamily: 'sans-serif', position:'relative'}}>
      <div style={{position:'absolute',top:16,right:16,fontSize:15}}>
        {user?.email} <button onClick={logout} style={{marginLeft:10,fontSize:13,background:'#f5f5fa',border:'none',padding:'3px 10px',borderRadius:4,cursor:'pointer',color:'#444'}}>Logout</button>
      </div>
      <h1 style={{textAlign:"center"}}>MOSDAC AI Help Bot</h1>
      <div style={{ minHeight: 220, border: '1px solid #eee', padding: 10, background: '#fafcff', marginBottom: 12, borderRadius:6 }}>
        {messages.length === 0 && <div style={{color:"#999"}}>Ask any question about MOSDAC data, products, or support</div>}
        {messages.map((msg,i) => (
          <div key={i} style={{ marginBottom: 12 }}>
            <div style={{ fontWeight: "bold" }}>You:</div>
            <div style={{ marginBottom: 4 }}>{msg.user}</div>
            <div style={{ fontWeight: "bold" }}>Bot:</div>
            <div style={{ color: '#23278a' }}>{msg.bot}</div>
          </div>
        ))}
        {loading && <div style={{ color: '#bbb' }}>Bot is typing...</div>}
      </div>
      <form onSubmit={handleSend} style={{display: 'flex', gap: 4}}>
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Type your question..."
          style={{flex:1, padding: "9px 12px", borderRadius:4, border:"1px solid #ddd"}}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !input.trim()} style={{padding: "9px 18px", borderRadius:4, border:'none', background: '#23278a', color:'#fff', fontWeight:'bold'}}>Send</button>
      </form>
    </div>
  );
}

export default App;
