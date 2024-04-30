import React, { useState, useEffect } from 'react';
import List from './components/List';
import Alert from './components/Alert';

const getLocalStorage = () => {
  let list = localStorage.getItem('list');
  if (list) {
    return (list = JSON.parse(localStorage.getItem('list')));
  } else {
    return [];
  }
};
const App = () => {
  const [name, setName] = useState('');
  const [list, setList] = useState(getLocalStorage());
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);
  const [alert, setAlert] = useState({ show:true, msg: 'hello', type: 'success' })

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!name) {
      //display alert
      showAlert(true,'danger','please enter the value');
    }
    else if (name && isEditing) {
      //deal with edit
      setList(list.map ((item) =>{
        if (item.id === editId) {
          return { ...item, title: name };
        }
        return item;

      })
    );
    setName('');
    setEditId(null);
    setIsEditing(false);
    showAlert(true, 'success', 'value changed');
    }
    else {
      //show alert
      showAlert(true,'success','item added to the list')
      const newItem = { id: new Date().getTime().toString(), title: name };
      setList([...list, newItem]);
      setName('');
    }
  };
  const showAlert = (show = false, type = '', msg = '') => {
    setAlert({ show, type, msg });
  };
  //clearing list
  const clearList = () => {
    showAlert(true, 'danger', 'empty list');
    setList([]);
  };

  //remove item
  const removeItem = (id) => {
    showAlert(true, 'danger', 'item removed');
    setList(list.filter((item) => item.id !== id));
  };

  //edit item
  const editItem = (id) => {
    const specificItem = list.find((item) => item.id === id);
    setIsEditing(true);
    setEditId(id);
    setName(specificItem.title);
  };

  //localStorage
  useEffect(() => {
    localStorage.setItem('list', JSON.stringify(list));
  }, [list]);

  return (
    <section className="section-center">
      <form className="grocery-form" onSubmit={handleSubmit}>
        {alert.show && <Alert {...alert} removeAlert={showAlert} list={list}/>}
        <h3>Grocery Bud</h3>
        <div className="form-control">
          <input type="text"
            className="grocery"
            placeholder="e.g.carrot"
            value={name}
            onChange={(e) => setName(e.target.value)} />
          <button type="submit" className="submit-btn">
            {isEditing ? 'edit' : 'submit'}
          </button>
        </div>
      </form>
      {list.length > 0 && (
        <div className="grocery-container">
          <List items={list} removeItem={removeItem} editItem={editItem} />
          <button className="clear-btn" onClick={clearList}>Clear Items</button>
        </div>
      )}
    </section>
  )


}

export default App;


/* 
 1)use of conditional rendering -> If list.length > 0 then show the grocery-container
 2)<Alert/> - use of spread operator
 3)useEffect- localStorage:
 setting the item by -->key-list and value- JSON.stringify(list)
4) localStorage fn - getting item form localStorage
if list exist - return JSON.parse(localStorage with previous list)
if not - empty array
 */