import { connect } from 'react-redux';
import { getClients } from '../actions';
import { getFilteringStatus, setRules } from '../actions/filtering';
import {
    getLogs, getLogsConfig, setLogsPagination, setLogsFilter, setLogsPage, toggleDetailedLogs,
} from '../actions/queryLogs';
import Logs from '../components/Logs';
import { addSuccessToast } from '../actions/toasts';
import { getDnsConfig } from '../actions/dnsConfig';

const mapStateToProps = (state) => {
    const {
        queryLogs, dashboard, filtering, dnsConfig,
    } = state;

    const props = {
        queryLogs, dashboard, filtering, dnsConfig,
    };
    return props;
};

const mapDispatchToProps = {
    getLogs,
    getFilteringStatus,
    setRules,
    addSuccessToast,
    getClients,
    getLogsConfig,
    setLogsPagination,
    setLogsFilter,
    setLogsPage,
    toggleDetailedLogs,
    getDnsConfig,
};

export default connect(
    mapStateToProps,
    mapDispatchToProps,
)(Logs);
