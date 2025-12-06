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
