import { IInputs, IOutputs } from "./generated/ManifestTypes";
import MUISelectControl_Class from "./App";
import { ISelectProps } from "./SelectControl";
import * as React from "react";
//import DataSetInterfaces = ComponentFramework.PropertyHelper.DataSetApi;
//type DataSet = ComponentFramework.PropertyTypes.DataSet;

export class MUISelect implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    //private textboxValue: string | undefined;
    private handleEvent: (newValue: string) => void;

    /**
     * Empty constructor.
     */
    constructor() { }

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
        // this.handleEvent = (newValue: string) => {
        //     this.textboxValue = newValue;
        //     this.notifyOutputChanged();
        // };
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
        const cleanedDisplayColumns = inputs.DisplayColumns?.raw?.replace(/\s/g, '');
        const displayColumnsArray = cleanedDisplayColumns ? cleanedDisplayColumns.split(",") : [];
        const props: ISelectProps =
        { 
            items: inputs.Items,
            displayColumns: displayColumnsArray,
            label: inputs.Label?.raw || "",
            style: inputs.Style.raw,
            multiSelect: inputs.MultipleSelection.raw,
            multiSelectStyle: inputs.MultiSelectStyle.raw,
            default: inputs.Default?.raw || "",
            placeholder: inputs.Placeholder?.raw || "",
            helperText: inputs.HelperText?.raw || "",
            size: inputs.Size.raw,
            //mode: inputs.Mode.raw,
            //rows: inputs.Rows.raw as number,
            required: inputs.Required.raw,
            //adornmnetPosition: inputs.AdornmentPosition.raw,
            //adornmentValue: inputs.AdornmentValue?.raw || "",
            //align: inputs.Align.raw,
            //verticalAlign: inputs.VerticalAlign.raw,
            appTheme: appTheme,
            isEnabled: context.mode.isControlDisabled,
            //handleEvent: this.handleEvent,
            //handleAutoSizing: this.handleAutoSizing,
            font: inputs.Font?.raw as string,
            fontSize: inputs.FontSize.raw as number,
            fontWeight: inputs.FontWeight.raw,
            fontColor: inputs.FontColor?.raw as string,
            primaryColor: inputs.PrimaryColor?.raw as string,
            validationState: inputs.ValidationState.raw
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
        return { };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }
}
