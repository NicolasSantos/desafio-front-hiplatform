import PropTypes from 'prop-types';


const Checkbox = props => {
    return (
        <>
            <input
                type="checkbox"
                checked={props.checked}
                onChange={() => props.handleChange} 
            />
            <span className={"checkmark " + (props.isPartial ? "is-partial" : "is-default")}></span>
        </>
    );
}

export default Checkbox;

Checkbox.propTypes = {
    checked: PropTypes.bool.isRequired,
    onChange: PropTypes.func.isRequired,
    isPartial: PropTypes.bool
};