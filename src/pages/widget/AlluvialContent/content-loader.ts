export type MilkdownContent = {
  contentType: string | null;
  content: string | string[];
};

export async function loadContent(arg: string): Promise<MilkdownContent> {
  const fetch_path = "/markdowns" + arg;
  var contentType: string | null = null;
  var content = "";

  await fetch(fetch_path, {
    method: "GET",
  }).then(async (res) => {
    contentType = res.headers.get("Content-Type");
    if (contentType?.includes("text/markdown")) {
      await res.text().then((markdown) => {
        content = markdown;
      });
    } else if (contentType?.includes("text/directory")) {
      await res.json().then((json) => {
        content = json;
      });
    } else if (contentType?.includes("text/html")) {
      await res.text().then((html) => {
        content = html;
      });
    } else {
    }
  });

  return { contentType, content };
}

export function toFile(fileName: string, data: any, mimeType: string) {
  return new File([new Blob([data], { type: mimeType })], fileName, {
    type: mimeType,
    lastModified: Date.now(),
  });
}

export async function saveContent(path: string, file: File) {
  const upload_path = "/markdowns" + path;
  const credentials = `test:secret`;
  const formData = new FormData();
  formData.append("file", file);

  fetch(upload_path, {
    method: "POST",
    headers: {
      Authorization: `Basic ${btoa(credentials)}`,
    },
    body: formData,
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("认证失败：用户名或密码错误。");
    }
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status}`);
    }
    return response;
  });
}

export async function saveContentBlob(path: string, blobValue: Blob) {
  const formData = new FormData();
  formData.append("file", await blobValue.text());

  fetch(path, {
    method: "POST",
    headers: {
      ContentType: blobValue.type,
    },
    body: formData,
  }).then((response) => {
    if (response.status === 401) {
      throw new Error("认证失败：用户名或密码错误。");
    }
    if (!response.ok) {
      throw new Error(`HTTP 错误: ${response.status}`);
    }
    return response;
  });
}
