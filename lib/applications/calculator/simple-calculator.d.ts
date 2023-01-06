import { Page, Router } from "../../x-application";
export declare class SimpleCalculator extends Page {
    private expression;
    private buttonPanel;
    private expressionTokens;
    constructor(router: Router);
    private createButtonPressListener;
    onBeforeMount(): void;
    onBeforeUnmount(): void;
    onUpdated(): void;
}
//# sourceMappingURL=simple-calculator.d.ts.map