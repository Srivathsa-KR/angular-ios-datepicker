import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  OnChanges,
  SimpleChanges,
  Output,
  HostListener,
  Renderer2,
  ViewChild,
  ElementRef
} from "@angular/core";

export const DEFAULT_SETTING_ENUM = {
  DEFAULT_TO_START: "DEFAULT_TO_START",
  DEFAULT_TO_END: "DEFAULT_TO_END"
};

export type DEFAULT_SETTING = keyof typeof DEFAULT_SETTING_ENUM;

const LIST_ITEM_HEIGHT = 50; //Height of each Item : px

const computeSelectedItemPosition = itemIndex => {
  const initialPosition = -1 * itemIndex * LIST_ITEM_HEIGHT;
  return initialPosition;
};

@Component({
  selector: "app-ios-wheel-picker",
  templateUrl: "./ios-wheel-picker.component.html",
  styleUrls: ["./ios-wheel-picker.component.scss"]
})
export class IosWheelPickerComponent implements OnInit, OnChanges {
  @Input("dataList") dataList: Array<any>;
  @Input("indexOfSelected") indexOfSelected: number;
  @Input("defaultSetting")
  defaultSetting: DEFAULT_SETTING = DEFAULT_SETTING_ENUM.DEFAULT_TO_END as DEFAULT_SETTING;
  @Output("onChange") changeEmitter = new EventEmitter<number>(true);
  @ViewChild("listContainer") listContainerEl: ElementRef;

  private offset: number = 0;
  private isDragging: boolean = false; //Behaviour subject?
  // private isDraggingSubj$ : BehaviorSubject<boolean> = new BehaviorSubject(false);
  // readonly isDraggingObserv$ = this.isDraggingSubj$.asObservable();
  private previousYCoordinate: number | null = null;
  private currentPosition: number;
  private maxPossiblePosition: number;
  private unlistenerArray: Array<() => void> = [];
  public inlineListStyle: Object;
  constructor(private renderer: Renderer2) {}

  ngOnInit() {
    // this.currentPosition = this.indexOfSelected
    //   ? computeSelectedItemPosition(this.indexOfSelected)
    //   : 0;
    // this.inlineListStyle = {
    //   "will-change": "transform",
    //   transition: `transform ${Math.abs(this.offset) / 100 + 0.1}s`,
    //   transform: `translateY(${this.currentPosition}px)`
    // };
    // this.maxPossiblePosition =
    //   -1 * (this.dataList.length - 1) * LIST_ITEM_HEIGHT;
  }

  ngOnChanges(change: SimpleChanges) {
    // console.log(change);
    if (change.dataList) {
      this.maxPossiblePosition = this.getMaxPossiblePosition();
    }
    if (change.indexOfSelected) {
      this.handleIndexOfSelectedChange(change.indexOfSelected.currentValue);
    }
  }

  private getMaxPossiblePosition(): number {
    return -1 * (this.dataList.length - 1) * LIST_ITEM_HEIGHT;
  }

  onMouseMove(event) {
    // console.log("Inside Mouse Move");
    // console.log({ event });
    const currentYCoordinate = event.touches
      ? event.touches[0].clientY
      : event.clientY; //handling multiple touches at any given time
    // console.log({ currentYCoordinate });
    // console.log(this.previousYCoordinate);
    const computedOffset = currentYCoordinate - this.previousYCoordinate;
    // console.log({computedOffset});
    const computedPosition = this.currentPosition + computedOffset;
    this.offset = computedOffset;
    this.previousYCoordinate = currentYCoordinate;
    // console.log({ computedPosition });
    // console.log(this.previousYCoordinate);
    const positionToBeSet = Math.max(
      this.maxPossiblePosition,
      Math.min(0, computedPosition)
    );
    this.inlineListStyle = this.getScrollAnimationStyle(
      computedOffset,
      positionToBeSet
    );
    // console.log({positionToBeSet});
    this.currentPosition = positionToBeSet;
  }

  @HostListener("mouseup", ["$event"])
  @HostListener("touchend", ["$event"])
  onMouseUp(event) {
    const posToBeRounded = this.currentPosition + this.offset * 5;
    const roundedPosition =
      Math.round(posToBeRounded / LIST_ITEM_HEIGHT) * LIST_ITEM_HEIGHT;
    const finalPosition = Math.max(
      this.maxPossiblePosition,
      Math.min(0, roundedPosition)
    );
    // console.log({ finalPosition }
    this.currentPosition = finalPosition;
    // console.log(this.unlistenerArray)
    this.inlineListStyle = this.getScrollAnimationStyle(
      this.offset,
      this.currentPosition
    );
    this.unlistenerArray.forEach(subsFunc => subsFunc());
    this.unlistenerArray = [];
    this.changeEmitter.emit((-1 * finalPosition) / LIST_ITEM_HEIGHT);
    // console.log(this.unlistenerArray);
  }

  @HostListener("mousedown", ["$event"])
  onMouseDown(event) {
    console.log("Inside Mouse Down");
    this.previousYCoordinate = event.touches
      ? event.touches[0].clientY
      : event.clientY; //handling multiple touches at any given time
    // this.isDraggingSubj$.next(true);
    this.unlistenerArray.push(
      ...[
        this.renderer.listen(
          this.listContainerEl.nativeElement,
          "mousemove",
          this.onMouseMove.bind(this)
        ),
        this.renderer.listen(
          this.listContainerEl.nativeElement,
          "touchmove",
          this.onMouseMove.bind(this)
        )
      ]
    );
  }

  trackByIndex(index: number, item) {
    return index;
  }

  private handleIndexOfSelectedChange(indexOfSelected: number): void {
    if (indexOfSelected === -1) {
      //Item not in the array
      const defaultIndex = this.getDefaultIndex(this.defaultSetting);
      this.changeEmitter.emit(defaultIndex);
    } else {
      this.currentPosition = this.indexOfSelected ? computeSelectedItemPosition(indexOfSelected) : 0;
      this.inlineListStyle = this.getScrollAnimationStyle(this.offset, this.currentPosition);
    }
  }

  private getScrollAnimationStyle(offset: number, position: number): object {
    const style = {
      transition: `transform ${Math.abs(offset) / 100 + 0.1}s`,
      transform: `translateY(${position}px)`
    };
    return style;
  }

  private getDefaultIndex(defaultSetting: DEFAULT_SETTING): number {
    if (defaultSetting === DEFAULT_SETTING_ENUM.DEFAULT_TO_END) {
      return this.dataList.length - 1;
    } else if (defaultSetting === DEFAULT_SETTING_ENUM.DEFAULT_TO_START) {
      return 0;
    }
  }
}
