import { connect } from 'react-redux';
import Swipe from './Swipe';
import { saveSwipe } from '../../reducers/Swipe/actions';

const mapStateToProps = (state, ownProps) => {
    return {}
};

const mapDispatchToProps = (dispatch, ownProps) => {
    return {
        saveSwipe: () => {
            dispatch(saveSwipe());
        }
    }
};

const SwipeContainer = connect(
    mapStateToProps,
    mapDispatchToProps
)(Swipe);

export default SwipeContainer;