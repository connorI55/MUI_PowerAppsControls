/*
*This is auto generated from the ControlManifest.Input.xml file
*/

// Define IInputs and IOutputs Type. They should match with ControlManifest.
export interface IInputs {
    Label: ComponentFramework.PropertyTypes.StringProperty;
    Size: ComponentFramework.PropertyTypes.EnumProperty<"small" | "medium" | "large">;
    Default: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    LabelPosition: ComponentFramework.PropertyTypes.EnumProperty<"end" | "start" | "top" | "bottom">;
    Align: ComponentFramework.PropertyTypes.EnumProperty<"flex-start" | "center" | "flex-end">;
    VerticalAlign: ComponentFramework.PropertyTypes.EnumProperty<"flex-start" | "center" | "flex-end">;
    Wrap: ComponentFramework.PropertyTypes.TwoOptionsProperty;
    Font: ComponentFramework.PropertyTypes.StringProperty;
    FontSize: ComponentFramework.PropertyTypes.WholeNumberProperty;
    FontColor: ComponentFramework.PropertyTypes.StringProperty;
    FontWeight: ComponentFramework.PropertyTypes.EnumProperty<"Lighter" | "Normal" | "Semibold" | "Bold">;
    PrimaryColor: ComponentFramework.PropertyTypes.StringProperty;
    RippleEffect: ComponentFramework.PropertyTypes.TwoOptionsProperty;
}
export interface IOutputs {
    Value?: boolean;
    AutoHeight?: number;
    AutoWidth?: number;
}
