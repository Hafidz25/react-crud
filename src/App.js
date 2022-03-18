
import "./App.css";
import List from "./List";
import {useState} from 'react';
import { uid } from "uid";
import { useEffect } from "react/cjs/react.development";
import axios from "axios";

function App() {

  const [contacts,setContacts] = useState([]);

  const [isUpdate, setIsUpdate] = useState({id: null, status: false });

  const [formData,setFormdata] = useState({
    name: "",
    telp: "",
  });

  useEffect(() => {
    axios.get("http://localhost:3000/contacts").then(res => {
      console.log(res.data);
      setContacts(res?.data ?? []);
    })
  },[])

  function handleChange(e) {
    let data = { ...formData };
    data[e.target.name] = e.target.value;
    setFormdata(data);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Anda yakin?");
    let data = [...contacts];

    if(formData.name === ""){
      return false
    }
    if(formData.telp === ""){
      return false
    }
    if(isUpdate.status){
      data.forEach((contact) => {
        if(contact.id === isUpdate.id){
          contact.name = formData.name;
          contact.telp = formData.telp;
        }
      })

      axios.put(`http://localhost:3000/contacts/${isUpdate.id}`, {
        name: formData.name,
        telp: formData.telp
      }).then(res => {
        alert('Berhasil mengedit data');
      });

    }else{
      let newData = {id: uid(), name: formData.name, telp: formData.telp}
      //menambah contact
      data.push(newData);
      axios.post('http://localhost:3000/contacts', newData).then(res => {
        alert('Berhasil menyimpan data');
      })
    }

    setIsUpdate({id: null, status: false});
    setContacts(data);
    setFormdata({name: "", telp: ""});
  }

  function handleEdit(id){
    let data = [...contacts];
    let foundData = data.find(contact => contact.id === id);
    setFormdata({name: foundData.name, telp: foundData.telp});
    setIsUpdate({id: id, status: true});
  }

  function handleDelete(id){
    let data =[...contacts];
    let filterData = data.filter(contact => contact.id !== id);
    setContacts(filterData);
    
    axios.delete(`http://localhost:3000/contacts/${id}`).then(res => {
      alert("Berhasil menghapus data");
    });
  }

  return (
    <div className="App">
      <div className="container">
        <h1 className="px-3 py-3">My Contact List</h1>

        <form onSubmit={handleSubmit} className="px-3 py-4">
          <div className="form-group">
            <label htmlFor="">Name</label>
            <input type="text" className="form-control" onChange={handleChange} value={formData.name} name="name" />
          </div>
          <div className="form-group mt-3">
            <label htmlFor="">No. Telp</label>
            <input type="text" className="form-control" onChange={handleChange} value={formData.telp} name="telp" />
          </div>
          <div>
            <button type="submit" className="btn btn-primary w-100 mt-3">
              Save
            </button>
          </div>
        </form>
      </div>

      <List handleDelete={handleDelete} handleEdit={handleEdit} data={contacts} />
    </div>
  );
}

export default App;
