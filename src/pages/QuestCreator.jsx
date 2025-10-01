import { useState } from "react"

export function QuestCreator()
{
    /*newItem holds current value of input feeld
    todos hold info from the feelds like title and id*/ 
    const [newItem,setNewItem] = useState("")
    const [todos, setQuest] = useState([])
    
    function submissionHandler(e){
        e.preventDefault()

        setQuest(currentQuest => {
            return [ ...currentQuest,
                //uses randomUUID to generate a unique ID
                {id: crypto.randomUUID(), title:newItem, remove: false},

            ]
        })
        setNewItem("") //resetts input field
    }

    function toggleQuest(id, remove){
        //uppdated teh remove status of an item
        setQuest(currentQuest=>{
            //finds item by id and keeps the other unchanged
            return currentQuest.map(todo =>{
                if(todo.id===id)
                {
                    return{...todo, remove}
                }
                return todo
            })
        })
    }

    function deleteQuest(id){
        setQuest(currentQuest =>{
            //fileter to keep all items but the one maching the id
            return currentQuest.filter(todo => todo.id !== id)
        })
    }
    return(
        <>
            <h1> Crate your quests here</h1>
            <form onSubmit={submissionHandler}>
                <div>
                    <label htmlFor="title">Quest title</label>
                    {/*e stand for event object and traget is in this case the 
                     textbox and value acceces the text in the box */} 
                    <input value={newItem} onChange={e => setNewItem(e.target.value)} type="text" maxLength="50" id = "title"/>
                </div>
                <div>
                    <lable htmlFor ="descript">Quest description</lable>
                    <input type="text" maxLength="200" id = "descript"/>
                </div>
            
                <div>
                    <label>One day</label>
                    <input type="radio" name="time_limit" value="1"/> 
                </div>
                <div>
                    <label>One week</label>
                    <input type="radio" name="time_limit" value="7"/> 
                </div>
                <div>
                    <label>30 days</label>
                    <input type="radio" name="time_limit" value="30"/> 
                </div>
                <div>
                    <label>No time limit</label>
                    <input type="radio" name="time_limit" value=""/> 
                </div>
                
                    <button className="create_btn">Create Quest</button>
                
            </form>
            <h1 className="header">Created quests:</h1>
            <ul className="list">

                {todos.map(todo =>{
                    return( <li key ={todo.id}>
                        <label >
                            <input type="checkbox" checked={todo.remove} 
                            onChange={e => toggleQuest(todo.id, e.target.checked)} />
                            {todo.title}
                        </label>
                        <button className="btn-delete-btn" onClick={()=>deleteQuest(todo.id)}> Delete </button>
                    </li>)
                
                })}
                
            </ul>

        </>
    )
}
