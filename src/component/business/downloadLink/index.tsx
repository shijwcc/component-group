import React from 'react';

interface IProps {
  content: string;
  link: string;
}
export default function DownloadLink(props: IProps) {
  function handleClick() {
    let url = props.link;
    let name = url.substring(url.lastIndexOf('/') + 1);
    let downLoad = async () => {
      let responsePromise = await fetch(url);
      console.log(responsePromise);
      let blob = await responsePromise.blob();
      let objectURL = window.URL.createObjectURL(blob);
      let a = document.createElement('a');
      a.href = objectURL;
      a.download = name;
      a.click();
      a.remove();
    };
    downLoad();
  }
  return <a onClick={handleClick} style={{color: '#3273F4'}}>{props.content}</a>;
}
