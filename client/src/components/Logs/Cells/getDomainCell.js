import React from 'react';
import classNames from 'classnames';
import PropTypes from 'prop-types';
import getHintElement from './getHintElement';
import { SCHEME_TO_PROTOCOL_MAP } from '../../../helpers/constants';

const getDomainCell = (props) => {
    const {
        row, t, isDetailed, dnssec_enabled,
    } = props;

    const {
        value, original: {
            tracker, type, answer_dnssec, client_proto,
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

    const data = {
        name_table_header: tracker && tracker.name,
        category_label: tracker && tracker.category,
        source_label: source && <a href={`//${source}`} className="link--green">{source}</a>,
    };

    const trackerHint = getHintElement({
        className: privacyIconClass,
        tooltipClass: 'pt-4 pb-5 px-5',
        dataTip: hasTracker,
        xlinkHref: 'privacy',
        contentItemClass: 'key-colon',
        content: Object.entries(data),
        columnClass: 'grid--gap-bg',
        title: 'known_tracker',
        place: 'bottom',
    });

    const ip = type ? `${t('type_table_header')}: ${type}` : '';

    const protocol = t(SCHEME_TO_PROTOCOL_MAP[client_proto]) || '';

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
