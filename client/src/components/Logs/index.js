import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Trans, withTranslation } from 'react-i18next';
import Modal from 'react-modal';
import { nanoid } from 'nanoid';
import {
    isSmallScreen,
    BLOCK_ACTIONS,
    TABLE_DEFAULT_PAGE_SIZE,
    TABLE_FIRST_PAGE,
    TRANSITION_TIMEOUT,
} from '../../helpers/constants';
import Loading from '../ui/Loading';
import Filters from './Filters';
import Table from './Table';
import Disabled from './Disabled';
import './Logs.css';

const INITIAL_REQUEST = true;
const INITIAL_REQUEST_DATA = ['', TABLE_FIRST_PAGE, INITIAL_REQUEST];

const processContent = (data, buttonType) => Object.entries(data)
    .map(([key, value]) => {
        const isTitle = value === 'title';
        const isButton = key === buttonType;
        const isBoolean = typeof value === 'boolean';
        const isHidden = isBoolean && value === false;

        let keyClass = 'key-colon';

        if (isTitle) {
            keyClass = 'title--border';
        }
        if (isButton || isBoolean) {
            keyClass = '';
        }

        return isHidden ? null : <Fragment key={nanoid()}>
            <div
                className={`key__${key} ${keyClass} ${(isBoolean && value === true) ? 'font-weight-bold' : ''}`}>
                <Trans>{isButton ? value : key}</Trans>
            </div>
            <div className={`value__${key} text-pre text-truncate`}>
                <Trans>{(isTitle || isButton || isBoolean) ? '' : value || '—'}</Trans>
            </div>
        </Fragment>;
    });


const Logs = (props) => {
    const [loading, setLoading] = useState(true);

    const [detailedDataCurrent, setDetailedDataCurrent] = useState({});
    const [buttonType, setButtonType] = useState(BLOCK_ACTIONS.BLOCK);
    const [isModalOpened, setModalOpened] = useState(false);

    const closeModal = () => setModalOpened(false);

    const getLogs = (older_than, page, initial) => {
        if (props.queryLogs.enabled) {
            props.getLogs({
                older_than,
                page,
                pageSize: TABLE_DEFAULT_PAGE_SIZE,
                initial,
            });
        }
    };

    useEffect(() => {
        props.setLogsPage(TABLE_FIRST_PAGE);
        getLogs(...INITIAL_REQUEST_DATA);
        props.getFilteringStatus();
        props.getLogsConfig();
        props.getClients();
        props.getDnsConfig();
    }, []);

    const refreshLogs = () => {
        setLoading(true);
        props.setLogsPage(TABLE_FIRST_PAGE);
        getLogs(...INITIAL_REQUEST_DATA);
        setTimeout(() => setLoading(false), TRANSITION_TIMEOUT);
    };

    const {
        filtering,
        setLogsPage,
        setLogsPagination,
        setLogsFilter,
        toggleDetailedLogs,
        dashboard,
        dnsConfig,
        queryLogs: {
            filter,
            enabled,
            processingGetConfig,
            processingAdditionalLogs,
            processingGetLogs,
            oldest,
            logs,
            pages,
            page,
            isDetailed,
        },
    } = props;

    return (
        <>
            {enabled && processingGetConfig && <Loading />}
            {enabled && !processingGetConfig && (
                <Fragment>
                    <Filters
                        filter={filter}
                        processingGetLogs={processingGetLogs}
                        processingAdditionalLogs={processingAdditionalLogs}
                        setLogsFilter={setLogsFilter}
                        refreshLogs={refreshLogs}
                    />
                    <Table
                        loading={loading}
                        setLoading={setLoading}
                        logs={logs}
                        pages={pages}
                        page={page}
                        autoClients={dashboard.autoClients}
                        oldest={oldest}
                        filtering={filtering}
                        processingGetLogs={processingGetLogs}
                        processingGetConfig={processingGetConfig}
                        isDetailed={isDetailed}
                        setLogsPagination={setLogsPagination}
                        setLogsPage={setLogsPage}
                        toggleDetailedLogs={toggleDetailedLogs}
                        getLogs={getLogs}
                        setRules={props.setRules}
                        addSuccessToast={props.addSuccessToast}
                        getFilteringStatus={props.getFilteringStatus}
                        dnssec_enabled={dnsConfig.dnssec_enabled}
                        setDetailedDataCurrent={setDetailedDataCurrent}
                        setButtonType={setButtonType}
                        setModalOpened={setModalOpened}
                    />
                    <Modal portalClassName='grid' isOpen={isSmallScreen && isModalOpened}
                           onRequestClose={closeModal}
                           style={{
                               content: {
                                   width: '100%',
                                   height: 'fit-content',
                                   left: 0,
                                   top: 47,
                                   padding: '1rem 1.5rem 1rem',
                               },
                               overlay: {
                                   backgroundColor: 'rgba(0,0,0,0.5)',
                               },
                           }}
                    >
                        <svg
                            className="icon icon--small icon-cross d-block d-md-none cursor--pointer"
                            onClick={closeModal}>
                            <use xlinkHref="#cross" />
                        </svg>
                        {processContent(detailedDataCurrent, buttonType)}
                    </Modal>
                </Fragment>
            )}
            {!enabled && !processingGetConfig && (
                <Disabled />
            )}
        </>
    );
};

Logs.propTypes = {
    getLogs: PropTypes.func.isRequired,
    queryLogs: PropTypes.object.isRequired,
    dashboard: PropTypes.object.isRequired,
    getFilteringStatus: PropTypes.func.isRequired,
    filtering: PropTypes.object.isRequired,
    setRules: PropTypes.func.isRequired,
    addSuccessToast: PropTypes.func.isRequired,
    getClients: PropTypes.func.isRequired,
    getDnsConfig: PropTypes.func.isRequired,
    getLogsConfig: PropTypes.func.isRequired,
    setLogsPagination: PropTypes.func.isRequired,
    setLogsFilter: PropTypes.func.isRequired,
    setLogsPage: PropTypes.func.isRequired,
    toggleDetailedLogs: PropTypes.func.isRequired,
    t: PropTypes.func.isRequired,
    dnsConfig: PropTypes.object.isRequired,
};

export default withTranslation()(Logs);
