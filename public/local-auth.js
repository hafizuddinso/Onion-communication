(function(){
  const USERS='oc_local_users_v5', SESSION='oc_local_session_v5', MESSAGES='oc_local_messages_v5';
  const enc=new TextEncoder();
  const b64=b=>btoa(String.fromCharCode(...new Uint8Array(b)));
  async function digest(password,salt){const data=new Uint8Array([...enc.encode(salt),...enc.encode(password)]);return b64(await crypto.subtle.digest('SHA-256',data));}
  const read=(k,f)=>{try{return JSON.parse(localStorage.getItem(k))||f}catch{return f}};
  const write=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
  window.LocalAuth={
    async signup(name,email,password){email=String(email||'').trim().toLowerCase();name=String(name||'').trim();password=String(password||'');if(name.length<2)throw Error('Enter your name.');if(password.length<8)throw Error('Use at least 8 characters for the password.');let users=read(USERS,[]);if(users.some(u=>u.email===email))throw Error('An account with this email already exists.');const salt=crypto.randomUUID();const hash=await digest(password,salt);const user={id:crypto.randomUUID(),name,email,salt,hash,created_at:new Date().toISOString()};users.push(user);write(USERS,users);write(SESSION,{user_id:user.id});return user;},
    async signin(email,password){email=email.trim().toLowerCase();const users=read(USERS,[]);const user=users.find(u=>u.email===email);if(!user||await digest(password,user.salt)!==user.hash)throw Error('Email or password is incorrect.');write(SESSION,{user_id:user.id});return user;},
    user(){const s=read(SESSION,null);if(!s)return null;const u=read(USERS,[]).find(x=>x.id===s.user_id);return u?{id:u.id,name:u.name,email:u.email}:null;},
    logout(){localStorage.removeItem(SESSION);location.href='/login';},
    messages(){return read(MESSAGES,[]);},
    send(body){const u=this.user();if(!u)throw Error('Sign in first.');let m=read(MESSAGES,[]);const x={id:crypto.randomUUID(),user_id:u.id,display_name:u.name,body:body.trim(),created_at:new Date().toISOString()};m.push(x);write(MESSAGES,m.slice(-300));window.dispatchEvent(new Event('oc-message'));return x;},
    clearDemo(){localStorage.removeItem(MESSAGES);}
  };
})();
