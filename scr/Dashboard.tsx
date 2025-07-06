import { useEffect, useState } from "react";

export default function Dashboard() {
  // Sample data
  const [stats] = useState({
    sessions: 127,
    totalQuestions: 634,
    users: 44,
    missions: 11,
    products: 28,
    popular: [
      { question: "How do I download data?", count: 35 },
      { question: "What is MOSDAC?", count: 20 },
      { question: "Which satellites are covered?", count: 16 },
    ],
  });

  // Animation effect for cards
  useEffect(() => {
    document.querySelectorAll('.card-pop').forEach(card => {
      card.classList.add('animate-fadein');
    });
  }, []);

  return (
    <div style={{ maxWidth: 780, margin: "0 auto", padding: 20, fontFamily: 'sans-serif' }}>
      <h1 style={{textAlign:'center',marginBottom:18}}>Dashboard: Analytics Overview</h1>
      <div style={{display:'flex',gap:16,flexWrap:'wrap',justifyContent:'center'}}>
        <div className="card-pop" style={{minWidth:170,padding:'22px',borderRadius:10,background:'#fafbff',boxShadow:'0 1px 4px #dde',flex:1,maxWidth:190}}>
          <div style={{fontSize:15,color:'#999'}}>Sessions</div>
          <div style={{fontSize:34,fontWeight:700,color:'#23278a'}}>{stats.sessions}</div>
        </div>
        <div className="card-pop" style={{minWidth:170,padding:'22px',borderRadius:10,background:'#fafbff',boxShadow:'0 1px 4px #dde',flex:1,maxWidth:190}}>
          <div style={{fontSize:15,color:'#999'}}>Questions</div>
          <div style={{fontSize:34,fontWeight:700,color:'#0b9e93'}}>{stats.totalQuestions}</div>
        </div>
        <div className="card-pop" style={{minWidth:170,padding:'22px',borderRadius:10,background:'#fafbff',boxShadow:'0 1px 4px #dde',flex:1,maxWidth:190}}>
          <div style={{fontSize:15,color:'#999'}}>Users</div>
          <div style={{fontSize:34,fontWeight:700,color:'#ea3a70'}}>{stats.users}</div>
        </div>
      </div>
      <div style={{display:'flex',marginTop:24,gap:16,flexWrap:'wrap'}}>
        <div className="card-pop" style={{flex:1,padding:'22px',borderRadius:10,background:'#f7f8fc',boxShadow:'0 1px 4px #dde',minWidth:210}}>
          <div style={{fontSize:15,color:'#999',marginBottom:6}}>Missions</div>
          <div style={{fontSize:28,fontWeight:700}}>{stats.missions}</div>
          <div style={{fontSize:15,color:'#999',margin:'10px 0 5px'}}>Products</div>
          <div style={{fontSize:22,fontWeight:650,color:'#23278a'}}>{stats.products}</div>
        </div>
        <div className="card-pop" style={{flex:2,padding:'22px',borderRadius:10,background:'#f7f8fc',boxShadow:'0 1px 4px #dde',minWidth:230}}>
          <div style={{fontSize:15,color:'#999',marginBottom:7}}>Popular Q&A</div>
          {stats.popular.map((item,i)=>(
            <div key={i} style={{marginBottom:8,fontSize:16}}>
              <span style={{color:'#23278a',fontWeight:600}}>{item.question}</span>
              <span style={{marginLeft:10,color:'#555'}}>x {item.count}</span>
            </div>
          ))}
        </div>
      </div>
      <div style={{margin:'36px 0 0',textAlign:'center'}}>
        <a href="/" style={{color:'#23278a',fontWeight:600,textDecoration:'underline'}}>⬅ Back to Chatbot</a>
      </div>
      <style>{`
        .animate-fadein { animation: fadeInPop .9s cubic-bezier(.2,.8,.3,1.2); }
        @keyframes fadeInPop {
          from { opacity:0; transform:scale(.97) translateY(12px); }
          to { opacity:1; transform:scale(1) translateY(0); }
        }
      `}</style>
    </div>
  );
}
