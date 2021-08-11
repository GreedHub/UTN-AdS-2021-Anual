import { ChangeEvent, useState } from 'react'

function useForm(initialValue:any) {

    const setInitialValue = ()=>{

        let newState = {...initialValue, status:{isValid:false}};

        Object.keys(newState).map(k=>{
   
            if(k === 'status'){
                return null;
            }

            newState[k].value = newState[k].value ? newState[k].value : '';

            newState[k].validation = newState[k].validation ? newState[k].validation : /.*/ ;

            if(!(newState[k].validation.test !== undefined || Array.isArray(newState[k].validation))){
                console.warn(`typeof validation for ${k} is not regex or array, defaulting to match everything`)
                newState[k].validation =  /.*/;
            };

            newState[k]['needsToBeToched'] = newState[k]['needsToBeToched'] ? newState[k]['needsToBeToched'] : true;
            
            newState[k]['hasBeenClicked'] =  !newState[k]['needsToBeToched'];

            newState[k]['isValid'] = (newState[k]['hasBeenClicked']
            ? (Array.isArray(newState[k].validation) ? newState[k].validation.includes(newState[k].value) : newState[k].validation.test(newState[k].value))
            : true);

            newState[k]['bind'] = {
                value: newState[k].value,
                error:!newState[k].isValid,
                name:k,
                onClick: (e:ChangeEvent)=>{
                    setValue(updateForm(e))
                },
                onChange: (e:ChangeEvent<HTMLInputElement>) =>{
                    setValue(updateForm(e))
                }
            }

             return null;
        });

        return newState;
        
    };

    const updateForm = (e:any) =>{
        let newState = {...value};
        if(!e.target.name) return newState;
        const name = e.target.name;
        newState[name].value = e.target.value;
        newState[name].hasBeenClicked = true;
        newState[name].isValid = (newState[name]['hasBeenClicked']                    
        ? (Array.isArray(newState[name].validation) ? newState[name].validation.includes(newState[name].value) : newState[name].validation.test(newState[name].value))
        : true);

        const isFormValid = Object.keys(newState).reduce((isFormValid,k)=>{
            return k ==='status' ? isFormValid : isFormValid && newState[k].isValid && newState[k].hasBeenClicked;
        },true);
        newState[name]['bind'].value = newState[name].value;
        newState[name]['bind'].error = !newState[name].isValid;
        newState.status.isValid = isFormValid;
        return newState;
    }

    const [value,setValue] = useState(setInitialValue());

    const reset = ()=>{
        setValue(setInitialValue());
    }

    return [value,reset]
}

export default useForm