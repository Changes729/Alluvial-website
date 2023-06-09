import React from 'react';

const uploader = () => {

  function submit(event: React.FormEvent<HTMLFormElement>) {
    const url = "/blobs/"
    console.log(url)
    event.preventDefault()

    // collect files
    let files = (document.querySelector('[name=file]') as HTMLInputElement).files

    if (files && files.length > 0) {
      const formData = new FormData()
      formData.append('File', files[0])

      // post form data
      const xhr = new XMLHttpRequest()

      // log response
      xhr.onload = () => {
        console.log(xhr.responseText)
      }

      // create and send the reqeust
      xhr.open('POST', url)
      xhr.send(formData)
    }
    else {
      console.log("file is empty")
    }
  }

  return (
    <div className="uploader" style={{textAlign : "center"}}>
      <form method="POST" encType="multipart/form-data" onSubmit={submit}>
        <input type="file" name="file" />
        <button type="submit" role="button">Upload File</button>
      </form>
    </div>
  );
}

export default uploader;