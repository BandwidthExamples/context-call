import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

window.performance.timing = {};
Enzyme.configure({adapter: new Adapter()});