import { useCallback, useEffect, useState } from 'react'
import './App.css'
import Navbar from './navbar'
import './todo.css'
import { toast } from 'react-toastify';
import ToastProvider from './TestProvider.jsx'
import BasicModal from './modal.jsx';

function App() {
  const [todoList, setTodoList] = useState([]);
  const [open, setOpen] = useState(false)
  const [txtValue, setTxtValue] = useState("")
  const [id, setId] = useState(null)

  const fetchData = useCallback(
    async () => {
      const response = await fetch("http://localhost:3000")
      const data = await response.json();
      setTodoList(data)
    },
    []
  )

  useEffect(() => {
    try {
      fetchData()
    }
    catch (e) {
      console.log(e)
    }
  }, [])


  const submitAddForm = async (e) => {
    e.preventDefault();
    const body = { content: e.target.inpField.value, isChecked: false }
    const response = await fetch("http://localhost:3000", {
      method: "POST",
      body: JSON.stringify(body),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    toast.success(data.text)
    fetchData()
    e.target.inpField.value = ""
  }

  async function deleteItem(objId) {
    const response = await fetch(`http://localhost:3000/${objId}`, { method: 'DELETE' })
    const data = await response.json()
    toast.success(data.text)
    fetchData()
  }

  function handleEditButtonClick(task) {
    handleId(task._id)
    setOpen(true)
  }

  async function handleCheck(objId, objChecked) {
    await fetch(`http://localhost:3000/${objId}`, {
      method: "PUT",
      body: JSON.stringify({
        isChecked: !objChecked
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    fetchData()
  }

  async function handleSave(value) {
    const response = await fetch(`http://localhost:3000/${id}`, {
      method: "PUT",
      body: JSON.stringify({
        content: value
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    const data = await response.json()
    toast.success(data.text)
    fetchData()
  }

  function handleId(id) {
    setId(id)
  }

  function handleClose() {
    setId(null)
    setOpen(false)
    setTxtValue("")
  }
  return (
    <>
      <ToastProvider>
        <Navbar />
        <div className='container'>
          <div className='searchBox'>
            <form onSubmit={submitAddForm}>
              <input type="text" className='inpField' id='inpField' placeholder='Enter Item' />
              <input type='submit' className='btn' value='Add' />
            </form>
          </div>
          {
            todoList.map((taskObj, index) => {
              return (
                <div key={index} className='taskDiv' >
                  <div className='displayBox'>
                    <input type="checkbox" onClick={(e) => { handleCheck(taskObj._id, taskObj.isChecked) }} />
                    <input type="text" disabled={true} style={{ marginLeft: "19px", border: "none", textDecoration: taskObj.isChecked ? "line-through" : "none", width: "600px" }} value={taskObj.content} />
                  </div>

                  <div className='imgDiv'>
                    <img src="editIcon.png" alt="" className='editImg' onClick={() => {handleEditButtonClick(taskObj)
                    }} />
                    <img src="deleteIcon.png" alt="" className='deleteImg' onClick={() => deleteItem(taskObj._id)} />
                  </div>
                </div>
              )
            })
          }
        </div>
        <BasicModal open={open} handleClose={handleClose} value={txtValue} handleValue={(e) => setTxtValue(e.target.value)} handleSave={handleSave} />
      </ToastProvider>
    </>
  )
}
export default App