import './sass/App.scss';
import { useEffect, useState } from 'react';
import CheckboxWrapper from './components/CheckboxWrapper';
import JsonData from './mocks/data.json';

function App() {
  const [data, setData] = useState(JSON.parse(localStorage.getItem("data")) || JsonData);
  const [copyData, setCopyData] = useState(null);

  useEffect(() => {
    if(copyData) {
      localStorage.setItem("data", JSON.stringify(copyData));
    }
  }, [copyData])

  const onChangeCheckbox = (item, parentRoot) => {
    let cloneData = {...data};
    let foundItem = findItem(item.id, cloneData);

    updateChildren(foundItem, !item.checked);
    updatePartialChecked(cloneData);
    setCopyData(cloneData);
  }

  const findItem = (id, listItem) => {
    let foundItem = null;

    Object.keys(listItem).find((item) => {
      if(listItem[item].id === id) {
        foundItem = listItem[item];  
        return true;
      } else {
        foundItem = findItem(id, listItem[item].children);
        return foundItem;
      }
    })

    return foundItem;
  }

  const updateChildren = (foundItem, checked) => {
    foundItem.checked = checked;

    Object.keys(foundItem.children).forEach((key) => {
      updateChildren(foundItem.children[key], checked);
    })
  }

  const updatePartialChecked = (listItem) => {
    Object.keys(listItem).forEach((key) => {
      const data = listItem[key];
      
      let childrenCheckedLength = getChildrenCheckedLength(data.children);
      data.partialChecked = childrenCheckedLength > 0 && childrenCheckedLength < Object.keys(data.children).length;
      
      updatePartialChecked(data.children);
    })
  }

  const getChildrenCheckedLength = (childData) => {
    return Object.keys(childData).filter(key => childData[key].checked).length;
  }

  return (
    <div className="container">
        <h1> Lista encadeada recursiva</h1>
        
        {
          Object.keys(data).map((item) => {
            return <CheckboxWrapper  key={data[item].id}
                                  ref={null}
                                  data={data[item]}
                                  onChangeCheckbox={onChangeCheckbox}
                                  onChangeParent={() => {}}
                                  parent={{id: null, name: "", checked: false}}
                                  parentRoot={data[item]}/>
          })
        }
    </div>
  );
}

export default App;
