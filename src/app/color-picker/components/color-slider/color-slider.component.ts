import { AfterViewInit, Component, ElementRef, EventEmitter, HostListener, Output, ViewChild } from '@angular/core';

@Component({
  selector: 'app-color-slider',
  templateUrl: './color-slider.component.html',
  styleUrls: ['./color-slider.component.css']
})
export class ColorSliderComponent implements AfterViewInit {
  @ViewChild('canvas')
  canvas!: ElementRef<HTMLCanvasElement>

  @Output()
  color: EventEmitter<string> = new EventEmitter()

  private ctx!: CanvasRenderingContext2D | null
  private mousedown: boolean = false
  private selectedHeight!: number

  @HostListener('window:mouseup', ['$event']) onMouseUp(evt: MouseEvent) {
    this.mousedown = false
  }

  ngAfterViewInit() {
    this.draw()
  }

  draw() {
    this.ctx = this.canvas.nativeElement.getContext('2d')
    const width = this.canvas.nativeElement.width
    const height = this.canvas.nativeElement.height

    if (!this.ctx) return
    this.ctx.clearRect(0, 0, width, height)

    const gradient = this.ctx.createLinearGradient(0, 0, 0, height)
    gradient.addColorStop(0, 'rgba(255, 0, 0, 1)')
    gradient.addColorStop(0.17, 'rgba(255, 255, 0, 1)')
    gradient.addColorStop(0.34, 'rgba(0, 255, 0, 1)')
    gradient.addColorStop(0.51, 'rgba(0, 255, 255, 1)')
    gradient.addColorStop(0.68, 'rgba(0, 0, 255, 1)')
    gradient.addColorStop(0.85, 'rgba(255, 0, 255, 1)')
    gradient.addColorStop(1, 'rgba(255, 0, 0, 1)')

    this.ctx.beginPath()
    this.ctx.rect(0, 0, width, height)

    this.ctx.fillStyle = gradient
    this.ctx.fill()
    this.ctx.closePath()

    if (this.selectedHeight) {
      this.ctx.beginPath()
      this.ctx.strokeStyle = 'white'
      this.ctx.lineWidth = 5
      this.ctx.rect(0, this.selectedHeight - 5, width, 10)
      this.ctx.stroke()
      this.ctx.closePath()
    }
  }

  onMouseDown(evt: MouseEvent) {
    this.mousedown = true
    this.selectedHeight = evt.offsetY
    this.draw()
    this.emitColor(evt.offsetX, evt.offsetY)
  }

  onMouseMove(evt: MouseEvent) {
    if (this.mousedown) {
      this.selectedHeight = evt.offsetY
      this.draw()
      this.emitColor(evt.offsetX, evt.offsetY)
    }
  }

  emitColor(x: number, y: number) {
    const rgbaColor = this.getColorAtPosition(x, y)
    this.color.emit(rgbaColor)
  }

  getColorAtPosition(x: number, y: number) {
    if (!this.ctx) return
    const imageData = this.ctx.getImageData(x, y, 1, 1).data
    return (
      'rgba(' + imageData[0] + ',' + imageData[1] + ',' + imageData[2] + ',1)'
    )
  }
}


