import { IInputs, IOutputs } from "./generated/ManifestTypes";
import MUISelectControl_Class from "./App";
import { ISelectProps } from "./SelectControl";
import * as React from "react";
//import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
//type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class MUISelect implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private selectedValue: string;
    private autoHeight: number;
    private autoWidth: number;

    /**
     * Empty constructor.
     */
    constructor() { 
        this.onChange = this.onChange.bind(this);
        this.handleAutoSizing = this.handleAutoSizing.bind(this);
        this.autoHeight=0;
        this.autoWidth=0;
        this.selectedValue = "";
        
    }

    onChange(newValue: string) {
        console.log("onChange called");
        this.selectedValue = newValue;
        this.notifyOutputChanged();
    }

    handleAutoSizing(height: number, width: number) {
        
        this.autoHeight = height;
        this.autoWidth = width;
        console.log("Handle Auto Sizing Called: Height: " + this.autoHeight + " Width: " + this.autoWidth);
        this.notifyOutputChanged()

    }

    /**
     * Used to initialize the control instance. Controls can kick off remote server calls and other initialization actions here.
     * Data-set values are not initialized here, use updateView.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to property names defined in the manifest, as well as utility functions.
     * @param notifyOutputChanged A callback method to alert the framework that the control has new outputs ready to be retrieved asynchronously.
     * @param state A piece of data that persists in one session for a single user. Can be set at any point in a controls life cycle by calling 'setControlState' in the Mode interface.
     */
    public init(
        context: ComponentFramework.Context<IInputs>,
        notifyOutputChanged: () => void,
        state: ComponentFramework.Dictionary
    ): void {
        this.notifyOutputChanged = notifyOutputChanged;
        context.mode.trackContainerResize(true);
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        console.log("updateView Called")
        const inputs = context.parameters
        const appTheme = context.fluentDesignLanguage?.tokenTheme
        const cleanedDisplayColumns = inputs.DisplayFields?.raw?.replace(/\s/g, '');
        const displayColumnsArray = cleanedDisplayColumns ? cleanedDisplayColumns.split(",") : [];
        const props: ISelectProps =
        { 
            records: inputs.Data.records,
            columns: inputs.Data.columns,
            sortedRecordIDs: inputs.Data.sortedRecordIds,
            displayColumns: displayColumnsArray,
            groupByColumn: inputs.GroupByField.raw || "",
            label: inputs.Label?.raw || "",
            style: inputs.Style.raw,
            multiSelect: inputs.MultipleSelection.raw,
            multiSelectStyle: inputs.MultiSelectStyle.raw,
            default: inputs.Default?.raw || "",
            placeholder: inputs.Placeholder?.raw || "",
            helperText: inputs.HelperText?.raw || "",
            size: inputs.Size.raw,
            required: inputs.Required.raw,
            expandWidth: inputs.ExpandWidth.raw,
            expandHeight: inputs.ExpandHeight.raw,
            align: inputs.Align.raw,
            verticalAlign: inputs.VerticalAlign.raw,
            appTheme: appTheme,
            isEnabled: context.mode.isControlDisabled,
            handleEvent: this.onChange,
            handleAutoSizing: this.handleAutoSizing,
            onChange: this.onChange,
            font: inputs.Font?.raw as string,
            fontSize: inputs.FontSize.raw as number,
            fontWeight: inputs.FontWeight.raw,
            fontColor: inputs.FontColor?.raw as string,
            primaryColor: inputs.PrimaryColor?.raw as string,
            validationState: inputs.ValidationState.raw,
            containerHeight: context.mode.allocatedHeight,
            containerWidth: context.mode.allocatedWidth
        };
        return React.createElement(
            MUISelectControl_Class, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as "bound" or "output"
     */


    public getOutputs(): IOutputs {
        return { 
            PickedItems: this.selectedValue,
            AutoHeight: this.autoHeight,
            AutoWidth: this.autoWidth
        } as IOutputs;
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
