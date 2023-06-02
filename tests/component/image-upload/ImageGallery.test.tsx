import { render, waitFor } from "@testing-library/react";
import { IPicture } from "components/interfaces";
import ImageGallery from "components/image-upload/ImageGallery";


jest.mock("next/router", () => require("next-router-mock"));

describe("ImageGallery", () => {
    beforeEach(async () => {
    });

    it("has Thumbnail", async () => {
        const dom = renderElement([{id:1,thumbnailUrl:"asdf",pictureUrl:"kjl"}]);

        await waitFor(() => expect(getImage(dom).src).toBe("http://localhost/asdf"));
    });
    it("has no Thumbnail", async () => {
        const dom = renderElement([{id:1,thumbnailUrl:undefined,pictureUrl:"kjl"}]);

        await waitFor(() => expect(getImage(dom).src).toBe("http://localhost/kjl"));
    });

});

function getImage(dom){
    return dom.container.querySelector("#activeImage");
}

function renderElement(images:IPicture[] ) {
    return render(
        <ImageGallery images={images}/>
);
}
