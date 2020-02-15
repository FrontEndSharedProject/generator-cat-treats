//  @ts-ignore
import lionImg from "@src/assets/real-one.jpg";
//  @ts-ignore
import $ from "jquery";
class Photo {
  constructor(className: string) {
    this.init(className);
  }

  init(className: string): void {
    $(className).append(
      `<img src="${lionImg}" class="real-one" style="z-index: 2;display: none;" />`
    );
    $(className)
      .hover(
        (): void => {
          $(".real-one").fadeIn();
        },
        (): void => {
          $(".real-one").fadeOut();
        }
      );
  }
}

export default Photo;
