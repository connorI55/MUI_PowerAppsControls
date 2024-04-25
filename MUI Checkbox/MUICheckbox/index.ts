import { IInputs, IOutputs } from "./generated/ManifestTypes";
import { ICheckboxProps } from "./CheckboxControl";
import MUI_CheckboxControl_Class from "./App";
import * as React from "react";

export class MUICheckbox implements ComponentFramework.ReactControl<IInputs, IOutputs> {
    private theComponent: ComponentFramework.ReactControl<IInputs, IOutputs>;
    private notifyOutputChanged: () => void;
    private checkboxValue: boolean;
    private autoHeight: number;
    private autoWidth: number;


    /**
     * Empty constructor.
     */
    constructor() {
        this.onChange = this.onChange.bind(this);
        this.handleAutoSizing = this.handleAutoSizing.bind(this);
    }

    onChange(newValue: boolean) {
        console.log("onChange called");
        this.checkboxValue = newValue;
        this.notifyOutputChanged();
    }

    handleAutoSizing(height: number, width: number) {
        this.autoHeight = height;
        this.autoWidth = width;
        //this.notifyOutputChanged();
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
    }

    /**
     * Called when any value in the property bag has changed. This includes field values, data-sets, global values such as container height and width, offline status, control metadata values such as label, visible, etc.
     * @param context The entire property bag available to control via Context Object; It contains values as set up by the customizer mapped to names defined in the manifest, as well as utility functions
     * @returns ReactElement root react element for the control
     */
    public updateView(context: ComponentFramework.Context<IInputs>): React.ReactElement {
        console.log("updateView called");
        const inputs = context.parameters
        const appTheme = context.fluentDesignLanguage?.tokenTheme
        const props: ICheckboxProps = 
        { 
            label: inputs.Label?.raw || "",
            size: inputs.Size.raw,
            value: inputs.Default.raw,
            labelPosition: inputs.LabelPosition.raw,
            align: inputs.Align.raw,
            verticalAlign: inputs.VerticalAlign.raw,
            wrap: inputs.Wrap.raw,
            appTheme: appTheme,
            isEnabled: context.mode.isControlDisabled,
            onChange: this.onChange,
            //handleAutoSizing: this.handleAutoSizing,
            rippleEffect: inputs.RippleEffect.raw,
            font: inputs.Font?.raw as string,
            fontSize: inputs.FontSize.raw as number,
            fontWeight: inputs.FontWeight.raw,
            fontColor: inputs.FontColor?.raw as string,
            primaryColor: inputs.PrimaryColor?.raw as string
        };
        return React.createElement(
            MUI_CheckboxControl_Class, props
        );
    }

    /**
     * It is called by the framework prior to a control receiving new data.
     * @returns an object based on nomenclature defined in manifest, expecting object[s] for property marked as “bound” or “output”
     */
    public getOutputs(): IOutputs {
        console.log("getOutputs called")
        return { 
            Value: this.checkboxValue,
            AutoHeight: this.autoHeight,
            AutoWidth: this.autoWidth
        };
    }

    /**
     * Called when the control is to be removed from the DOM tree. Controls should use this call for cleanup.
     * i.e. cancelling any pending remote calls, removing listeners, etc.
     */
    public destroy(): void {
        // Add code to cleanup control if necessary
    }

    public generateRandomKey() {
        return `key_${Math.random().toString(36).substr(2, 9)}_${Date.now()}`;
      }
}
