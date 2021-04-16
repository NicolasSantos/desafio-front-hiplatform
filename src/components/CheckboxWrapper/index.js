import PropTypes from 'prop-types';
import React, { useEffect, useState, forwardRef, useImperativeHandle} from 'react';
import Checkbox from '../Checkbox';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faChevronDown, faChevronUp } from '@fortawesome/free-solid-svg-icons'


const CheckboxWrapper = forwardRef((props, ref) => {
    const [itemData, setItemData] = useState(props.data);
    const [isPartial, setIsPartial] = useState(props.data.isPartial || false);
    const [hasUpdateOnChangeParent, setHasUpdateOnChangeParent] = useState(false);
    const [collapseActive, setCollapseActive] = useState(false);
    const [hasInitComponent, setHasInitComponent] = useState(false);
    const refsChildren = [];

    useEffect(() => {
        setHasInitComponent(true);
    }, [])

    useEffect(() => {
        let cloneChildren = {...itemData.children};

        Object.keys(cloneChildren).forEach((key) => {
            cloneChildren[key].checked = itemData.checked;
        })

        setItemData({...itemData, children: cloneChildren});
        
        props.onChangeParent && props.onChangeParent();
    }, [itemData.checked])

    useEffect(() => {
        if(hasInitComponent) {
            setItemData({...itemData, checked: props.parent.checked});
        }
    }, [props.parent.checked])

    const handleChange = () => {
        setItemData({...itemData, checked: !itemData.checked});
        props.onChangeCheckbox(itemData, props.parentRoot);
    }

    const mapChildren = () => {
        let formatted = Object.keys(itemData.children).map((key, index) => {
            const refItem = React.createRef();
            refsChildren[index] = refItem;
            
            return <CheckboxWrapper    key={itemData.children[key].id}
                                    ref={refItem}
                                    data={itemData.children[key]}
                                    onChangeCheckbox={props.onChangeCheckbox}
                                    onChangeParent={onChangeParent}
                                    parent={itemData}
                                    parentRoot={props.parentRoot}/>
        }); 

        return formatted;
    }

    useImperativeHandle(ref, () => ({
        getCheckboxState: () =>  {
            return itemData;
        }
    }));

    const onChangeParent = () => {
        let lengthChildrenChecked = getLengthChildrenChecked(refsChildren);
        let isPartialChecked = isPartialCheckedChildren(refsChildren, lengthChildrenChecked);
        setIsPartial(isPartialChecked);

        if(hasUpdateOnChangeParent) {
            setHasUpdateOnChangeParent(false);

            return;
        }

        props.onChangeParent(props.parent);
    }

    const getLengthChildrenChecked = (list) => {
        return list.filter(refItem => refItem.current.getCheckboxState().checked).length;
    }
    
    const isPartialCheckedChildren = (list, lengthChildrenChecked) => {
        return lengthChildrenChecked > 0 && lengthChildrenChecked < list.length;
    }

    return (
        <div className="checkbox-wrapper" style={{width: `calc(100% - ${10}px)`, marginLeft: `${10}px`}}>
            <div className="wrapper-content">
                <div className="checkbox-wrapper__checkbox-container" onClick={handleChange}>
                    <Checkbox checked={itemData.checked || false} onChange={handleChange} isPartial={isPartial}/>
                    <span className="name">{props.data.name}</span>
                </div>
                {
                    Object.keys(itemData.children).length > 0 
                    ? collapseActive 
                        ? <FontAwesomeIcon icon={faChevronUp} onClick={() => setCollapseActive(!collapseActive)}/>
                        : <FontAwesomeIcon icon={faChevronDown} onClick={() => setCollapseActive(!collapseActive)}/>
                    : ""
                }
            </div>

            <div style={{display: collapseActive ? "block" : "none"}}>
                { mapChildren() }
            </div>
        </div>
    )
})

export default CheckboxWrapper;

CheckboxWrapper.propTypes = {
    data: PropTypes.object.isRequired,
    onChangeCheckbox: PropTypes.func.isRequired,
    onChangeParent: PropTypes.func.isRequired,
    parent: PropTypes.object,
    parentRoot: PropTypes.object
};