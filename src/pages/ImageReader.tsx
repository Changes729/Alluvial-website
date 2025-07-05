import React, { Component } from "react";

class ImageContainer extends Component {
  constructor(props: {}) {
    super(props);
    this.state = { doc: "" };

    this.loadView = this.loadView.bind(this);
  }

  loadView(arg: string) {
    var fetch_path = "/blobs" + arg.substr("/images".length);
    console.log(fetch_path)

    if (fetch_path.endsWith("/")) {
      fetch(fetch_path, {
        method: "GET",
      }).then((res) => {
        res.text().then((xml) => {
          const doc = new DOMParser().parseFromString(xml, "application/xml");
          const errorNode = doc.querySelector("parsererror");
          if (errorNode) {
            console.log("error while parsing");
          } else {
            var container = document.getElementById('imageContainer');
            var docFrag = document.createDocumentFragment();
            const infos = doc.getElementsByTagName("a");
            for (var i = 0; i < infos.length; i++) {
              var url = infos[i].getAttribute("href");
              if (!url?.endsWith("/")) {
                url = fetch_path + url
                var img = document.createElement('img');
                img.style["width"] = "12.5vw"
                img.style["minWidth"] = "20vh"
                img.src = url!;
                docFrag.appendChild(img);
              }
            }
            container!.appendChild(docFrag);
          }
        });
      });
    }
  }

  componentDidMount() {
    // var imgs = ['/blobs/2.0%20cobox%20logo.svg',
    //   '/blobs/3D%E6%89%93%E5%8D%B0%E4%B8%8D%E7%94%A8%E4%B8%8A%E8%89%B2.png',
    //   '/blobs/demo/2.0%20cobox%20logo.svg'];
    // var container = document.getElementById('imageContainer');
    // var docFrag = document.createDocumentFragment();

    // if (container) {
    //   imgs.forEach(function (url, index, originalArray) {
    //     var img = document.createElement('img');
    //     img.style["width"] = "12.5vw"
    //     img.src = url;
    //     docFrag.appendChild(img);
    //   });

    //   container.appendChild(docFrag);
    // }
    this.loadView(window.location.pathname)
  }

  componentWillUpdate() {
  }

  render() {
    return <div id="imageContainer"></div>
  }
}


export default ImageContainer