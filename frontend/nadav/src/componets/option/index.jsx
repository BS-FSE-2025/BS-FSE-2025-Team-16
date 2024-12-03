function OptionsList({optionsList, InputValue, setInputValue}){
    return(
        // .toString().split(',')
        <div>
            <select value={InputValue} onChange={(e)=>{setInputValue(e.target.value)}} className="col-12" multiple={false}>
                <option value={"ריק"}>ריק</option>
                {
                    optionsList.map((each)=>(
                        <option key={each.id} value={each.name}>{each.name}</option>
                    ))
                }
            </select>
        </div>
    )
}
export default  OptionsList;