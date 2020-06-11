import React, { Fragment } from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import { Trans } from 'react-i18next';
import getHintElement from './getHintElement';
import { SCHEME_TO_PROTOCOL_MAP } from '../../../helpers/constants';

const processContent = (data) => Object.entries(data)
    .map(([key, value]) => {
        const isTitle = value === 'title';

        let keyClass = '';

        if (isTitle) {
            keyClass = 'grid--title';
        }

        return <Fragment key={key}>
            <div className={keyClass || 'key-colon'}>
                <Trans>{key}</Trans>
            </div>
            <div className={'text-pre text-truncate'}>
                <Trans>{isTitle ? '' : value || '—'}</Trans>
            </div>
        </Fragment>;
    });


const getDomainCell = (props) => {
    const {
        row, t, isDetailed, dnssec_enabled,
    } = props;

    const {
        value, original: {
            tracker, type, answer_dnssec, client_proto, domain,
        },
    } = row;

    const hasTracker = !!tracker;

    const source = tracker && tracker.sourceData && tracker.sourceData.name;

    const lockIconClass = classNames('icons', 'icon--small', 'd-none', 'd-sm-block', 'cursor--pointer', {
        'icon--active': answer_dnssec,
        'icon--disabled': !answer_dnssec,
        'my-3': isDetailed,
    });

    const privacyIconClass = classNames('icons', 'mx-2', 'icon--small', 'd-none', 'd-sm-block', 'cursor--pointer', {
        'icon--active': hasTracker,
        'icon--disabled': !hasTracker,
        'my-3': isDetailed,
    });

    const dnssecHint = getHintElement({
        className: lockIconClass,
        tooltipClass: 'py-4 px-5 pb-45',
        dataTip: answer_dnssec,
        xlinkHref: 'lock',
        columnClass: 'w-100',
        content: 'validated_with_dnssec',
        place: 'bottom',
    });

    const protocol = t(SCHEME_TO_PROTOCOL_MAP[client_proto]) || '';
    const ip = type ? `${t('type_table_header')}: ${type}` : '';

    const requestDetails = {
        request_details: 'title',
        domain,
        type_table_header: type,
        protocol,
    };

    const knownTrackerData = {
        known_tracker: 'title',
        name_table_header: tracker && tracker.name,
        category_label: tracker && tracker.category,
        source_label: source && <a href={`//${source}`} className="link--green">{source}</a>,
    };

    const trackerData = hasTracker ? { ...requestDetails, ...knownTrackerData } : requestDetails;

    const trackerHint = getHintElement({
        className: privacyIconClass,
        tooltipClass: 'pt-4 pb-5 px-5',
        dataTip: true,
        xlinkHref: 'privacy',
        contentItemClass: 'key-colon',
        renderContent: processContent(trackerData),
        place: 'bottom',
    });

    const valueClass = classNames('w-100', {
        'px-2 d-flex justify-content-center flex-column': isDetailed,
    });

    return (
        <div className="logs__row o-hidden" title={value}>
            {dnssec_enabled && dnssecHint}
            {trackerHint}
            <div className={valueClass}>
                <div className="text-truncate">{value}</div>
                {(ip || protocol) && isDetailed
                && <div className="detailed-info d-none d-sm-block text-truncate">
                    {`${ip}${ip && protocol && ', '}${protocol}`}
                </div>}
            </div>
        </div>
    );
};

getDomainCell.propTypes = {
    row: PropTypes.object.isRequired,
    t: PropTypes.func.isRequired,
    isDetailed: PropTypes.bool.isRequired,
    toggleBlocking: PropTypes.func.isRequired,
    autoClients: PropTypes.array.isRequired,
    dnssec_enabled: PropTypes.bool.isRequired,
};

export default getDomainCell;
