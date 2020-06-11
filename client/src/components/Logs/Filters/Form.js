import React from 'react';
import PropTypes from 'prop-types';
import { Field, reduxForm } from 'redux-form';
import { withTranslation } from 'react-i18next';
import flow from 'lodash/flow';
import debounce from 'lodash/debounce';
import { useDispatch } from 'react-redux';
import { DEBOUNCE_FILTER_TIMEOUT, FORM_NAME, RESPONSE_FILTER } from '../../../helpers/constants';
import Tooltip from '../../ui/Tooltip';
import { setLogsFilter } from '../../../actions/queryLogs';

const renderFilterField = ({
    input,
    id,
    className,
    placeholder,
    type,
    disabled,
    autoComplete,
    tooltip,
    meta: { touched, error },
}) => <>
    <div className="input-group-search">
        <svg className="icons icon--small icon--gray">
            <use xlinkHref="#magnifier" />
        </svg>
    </div>
    <input
        {...input}
        id={id}
        placeholder={placeholder}
        type={type}
        className={className}
        disabled={disabled}
        autoComplete={autoComplete}
        aria-label={placeholder} />
    <span className="logs__notice">
                <Tooltip text={tooltip} type='tooltip-custom--logs' />
            </span>
    {!disabled
    && touched
    && (error && <span className="form__message form__message--error">{error}</span>)}
</>;

renderFilterField.propTypes = {
    input: PropTypes.object.isRequired,
    id: PropTypes.string.isRequired,
    className: PropTypes.string,
    placeholder: PropTypes.string,
    type: PropTypes.string,
    disabled: PropTypes.string,
    autoComplete: PropTypes.string,
    tooltip: PropTypes.string,
    meta: PropTypes.shape({
        touched: PropTypes.bool,
        error: PropTypes.object,
    }).isRequired,
};

const Form = (props) => {
    const {
        t,
        className = '',
        responseStatusClass,
    } = props;

    const dispatch = useDispatch();

    const onChange = debounce(async ({ search = '', response_status }) => {
        await dispatch(setLogsFilter({
            search,
            response_status,
        }));
    }, DEBOUNCE_FILTER_TIMEOUT);

    return (
        <form className="d-flex flex-wrap form-control--container"
              onSubmit={(e) => {
                  e.preventDefault();
              }}>
            <Field
                id="search"
                name="search"
                component={renderFilterField}
                type="text"
                className={`form-control--search form-control--transparent ${className}`}
                placeholder={t('domain_or_client')}
                tooltip={t('query_log_strict_search')}
                onChange={onChange}
            />
            <div className="field__select">
                <Field
                    name="response_status"
                    component="select"
                    className={`form-control custom-select custom-select--logs custom-select__arrow--left ml-small form-control--transparent ${responseStatusClass}`}
                >
                    {Object.values(RESPONSE_FILTER)
                        .map(({
                            query, label, disabled,
                        }) => <option key={label} value={query}
                                      disabled={disabled}>{t(label)}</option>)}
                </Field>
            </div>
        </form>
    );
};

Form.propTypes = {
    handleChange: PropTypes.func,
    className: PropTypes.string,
    responseStatusClass: PropTypes.string,
    t: PropTypes.func.isRequired,
};

export default flow([
    withTranslation(),
    reduxForm({
        form: FORM_NAME.LOGS_FILTER,
    }),
])(Form);
