import React, { Component, PropTypes } from "react";
import _ from "underscore";

import MetabaseAnalytics from "metabase/lib/analytics";

import MetadataHeader from './MetadataHeader.jsx';
import MetadataTablePicker from './MetadataTablePicker.jsx';
import MetadataTable from './MetadataTable.jsx';
import MetadataSchema from './MetadataSchema.jsx';

export default class MetadataEditor extends Component {
    constructor(props, context) {
        super(props, context);
        this.toggleShowSchema = this.toggleShowSchema.bind(this);
        this.updateField = this.updateField.bind(this);
        this.updateFieldSpecialType = this.updateFieldSpecialType.bind(this);
        this.updateFieldTarget = this.updateFieldTarget.bind(this);
        this.updateTable = this.updateTable.bind(this);

        this.state = {
            isShowingSchema: false
        };
    }

    static propTypes = {
        databaseId: PropTypes.number,
        databases: PropTypes.array.isRequired,
        selectDatabase: PropTypes.func.isRequired,
        databaseMetadata: PropTypes.object,
        tableId: PropTypes.number,
        tables: PropTypes.object.isRequired,
        selectTable: PropTypes.func.isRequired,
        idfields: PropTypes.array.isRequired,
        updateTable: PropTypes.func.isRequired,
        updateField: PropTypes.func.isRequired,
        updateFieldSpecialType: PropTypes.func.isRequired,
        updateFieldTarget: PropTypes.func.isRequired
    };

    toggleShowSchema() {
        this.setState({ isShowingSchema: !this.state.isShowingSchema });
        MetabaseAnalytics.trackEvent("Data Model", "Show OG Schema", !this.state.isShowingSchema);
    }

    handleSaveResult(promise) {
        this.refs.header.setSaving();
        promise.then(() => {
            this.refs.header.setSaved();
        }, (error) => {
            this.refs.header.setSaveError(error.data);
        });
    }

    updateTable(table) {
        this.handleSaveResult(this.props.updateTable(table));
        MetabaseAnalytics.trackEvent("Data Model", "Update Table");
    }

    updateField(field) {
        this.handleSaveResult(this.props.updateField(field));
        MetabaseAnalytics.trackEvent("Data Model", "Update Field");
    }

    updateFieldSpecialType(field) {
        this.handleSaveResult(this.props.updateFieldSpecialType(field));
        MetabaseAnalytics.trackEvent("Data Model", "Update Field Special-Type", field.special_type);
    }

    updateFieldTarget(field) {
        this.handleSaveResult(this.props.updateFieldTarget(field));
        MetabaseAnalytics.trackEvent("Data Model", "Update Field Target");
    }

    render() {
        var tableMetadata = (this.props.databaseMetadata) ? _.findWhere(this.props.databaseMetadata.tables, {id: this.props.tableId}) : null;
        var content;
        if (tableMetadata) {
            if (this.state.isShowingSchema) {
                content = (<MetadataSchema tableMetadata={tableMetadata} />);
            } else {
                content = (
                    <MetadataTable
                        tableMetadata={tableMetadata}
                        idfields={this.props.idfields}
                        updateTable={this.updateTable}
                        updateField={this.updateField}
                        updateFieldSpecialType={this.updateFieldSpecialType}
                        updateFieldTarget={this.updateFieldTarget}
                        onRetireSegment={this.props.onRetireSegment}
                        onRetireMetric={this.props.onRetireMetric}
                    />
                );
            }
        } else {
            content = (
                <div style={{paddingTop: "10rem"}} className="full text-centered">
                    <h2 className="text-grey-3">Select any table to see its schema and add or edit metadata.</h2>
                </div>
            );
        }
        return (
            <div className="p3">
                <MetadataHeader
                    ref="header"
                    databaseId={this.props.databaseId}
                    databases={this.props.databases}
                    selectDatabase={this.props.selectDatabase}
                    isShowingSchema={this.state.isShowingSchema}
                    toggleShowSchema={this.toggleShowSchema}
                />
              <div style={{minHeight: "60vh"}} className="flex flex-row flex-full mt2 full-height">
                    <MetadataTablePicker
                        tableId={this.props.tableId}
                        tables={(this.props.databaseMetadata) ? this.props.databaseMetadata.tables : []}
                        selectTable={this.props.selectTable}
                    />
                    {content}
                </div>
            </div>
        );
    }
}
