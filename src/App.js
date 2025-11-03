import { useState,useEffect, useRef } from 'react';
import './App.css';
import {Button,EditableText,InputGroup,OverlayToaster,Position} from  '@blueprintjs/core';

function App() {

  const [users,setUser]=useState([]);
  const [newName,setnewName]=useState("");
  const [newEmail,setnewEmail]=useState("");
  const [newWebsite,setnewWebsite]=useState("");
  const AppToaster = useRef(null);
  
  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then((response)=> response.json())
    .then((json)=>setUser(json))
  },[])
  function addUser(){
    const name=newName.trim();
    const email=newEmail.trim();
    const website=newWebsite.trim();
    if(name && email && website){
      fetch("https://jsonplaceholder.typicode.com/users",
      {
        method :"POST",
        body: JSON.stringify({
          name,email,website
        }),
        headers: {
          "Content-Type":"application/json;charset=UTF-8"
        }
      }
    ) .then((response)=>response.json())
      .then (data=>{setUser([...users, data]);
     AppToaster.current?.show({
      message:"User added sucessfully",
      intent:'success',
      timeout:3000
     });
     setnewName("");
     setnewEmail("");
     setnewWebsite("");

     
    });
    }
  }
  function onchangeHandler(id,key,value){
    setUser((users)=>{
      return users.map(user=>{
        return user.id === id?{...user,[key]:value}:user;
      })
    })
  }
  function updateUser(id){
    const user =users.find((user)=>user.id===id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
      {
        method :"PUT",
        body: JSON.stringify(user),
        headers :{
          "Content-Type" :"application/json;charset=UTF-8"
        }  
      }
    ).then((response)=>response.json())
    .then(data=>{
      AppToaster.current?.show({
        message :"user updated sucessfully",
        intent :'success',
        timeout:3000

      })
    })
  }
  function deleteUser(id){
    const user =users.find((user)=>user.id===id);
    fetch(`https://jsonplaceholder.typicode.com/users/${id}`,
      {
      method:'DELETE',
    }).then(response=>response.json())
    .then (data=>{setUser((user)=>{
      return user.filter(user => user.id!==id)
    })
    AppToaster.current?.show({
      message:'Successfully deleted',
      intent:'success',
      timeout :3000
    })

  })


  }
  
  return (
    <div className="App" >
      <OverlayToaster position={Position.TOP} ref={AppToaster} />
      <table className='bp4-html-table modifier'>
        <thead>
          <th>ID</th>
          <th>Name</th>
          <th>Email</th>
          <th>Website</th>
          <th>Actions</th>
        </thead>
        <tbody>
          {users.map(user=>
          <tr key={user.id}>
            <td>{user.id}</td>
            <td><EditableText onChange={value=>onchangeHandler( user.id,'name',value)}value={user.name}/></td>
            <td><EditableText onChange={value=> onchangeHandler(user.id,'email',value)}value={user.email}/></td>            
            <td><EditableText onChange={value=> onchangeHandler(user.id,'website',value)}value={user.website} /></td>
            <td>
              <Button intent ="primary" onClick={()=>{updateUser(user.id)}}>Update</Button>
              &nbsp;
              <Button intent="danger" onClick={()=>{deleteUser(user.id)}}>Delete</Button>
            </td>
          </tr>
        )}
        </tbody>
        <tfoot>
          <tr>
          <td></td>
          <td>
            <InputGroup  value={newName} onChange={(e)=>setnewName(e.target.value)} placeholder='Enter your name..' />
          </td>
          <td>
            <InputGroup value={ newEmail} onChange={(e)=>setnewEmail(e.target.value)} placeholder='Enter Your Email'/>
          </td>
          <td>
            <InputGroup value ={newWebsite} onChange={(e)=>setnewWebsite(e.target.value)} placeholder='Enter the Website'/>
          </td>
          <td>
          <Button intent="success" onClick={addUser} > Add User</Button>
        </td>
        </tr>
        </tfoot>
      </table>

    </div>
  );
}

export default App;
