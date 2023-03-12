import dynamic from 'next/dynamic';
import { MutableRefObject } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

import { uploadS3 } from '@/lib/request/post';
import { GalleryCardType } from '@/lib/types';

const Editor = dynamic(
  // @ts-ignore
  () => import('@tinymce/tinymce-react').then(({ Editor }) => Editor),
  {
    ssr: false,
  }
);

interface Props {
  editorRef: MutableRefObject<TinyMCEEditor | null>;
  uploadGraph: MutableRefObject<((src: string) => void) | null>;
  uploadGallery: MutableRefObject<((gallery: GalleryCardType) => void) | null>;
  openModal: (mode: 'graph' | 'gallery') => void;
  initText?: string;
  setContentEmpty: (empty: boolean) => void;
}

const PostEditor = ({
  editorRef,
  uploadGraph,
  openModal,
  setContentEmpty,
  initText,
  uploadGallery,
  ...rest
}: Props) => {
  return (
    <Editor
      {...rest}
      tinymceScriptSrc={'/tinymce/tinymce.min.js'}
      onInit={(evt, editor) => {
        editorRef.current = editor;
        if (initText) {
          setTimeout(() => editor.setContent(initText), 0);
        }

        uploadGraph.current = async (src: string) => {
          const img = `<img src="${src}" alt="graph">`;
          editor.insertContent(img);
        };

        uploadGallery.current = async ({
          title,
          description,
          image,
        }: GalleryCardType) => {
          const table = `<table style="border-collapse: collapse; border-width: 1px;"><tbody><tr><td style="text-align: center; vertical-align: top; border-width: 1px; padding: 0;"><img src="${image}" alt="${title}" width="400"></td></tr><tr><td style="text-align: center; vertical-align: top; border-width: 1px; padding: 0;"><h2>${title}</h2><p>${description}</p></td></tr></tbody></table>`;
          editor.insertContent(table);
        };
      }}
      onFocusOut={() => {
        if (editorRef.current) {
          setContentEmpty(editorRef.current.getContent() === '');
        }
      }}
      init={{
        setup: function (editor) {
          editor.ui.registry.addButton('add_graph', {
            text: 'Add Graph',
            onAction: function () {
              openModal('graph');
            },
          });
          editor.ui.registry.addButton('add_gallery', {
            text: 'Add Gallery',
            onAction: function () {
              openModal('gallery');
            },
          });

          editor.ui.registry.addButton('add_template', {
            text: 'Add Template',
            onAction: function () {
              editor.windowManager.open({
                title: 'Add Template',
                body: {
                  type: 'panel',
                  items: [
                    {
                      type: 'input',
                      label: 'row',
                      name: 'row',
                    },
                    {
                      type: 'input',
                      label: 'col',
                      name: 'col',
                    },
                    {
                      type: 'checkbox',
                      label: 'only image',
                      name: 'onlyImage',
                    },
                  ],
                },
                buttons: [
                  {
                    type: 'cancel',
                    name: 'cancel',
                    text: 'Cancel',
                  },
                  {
                    type: 'submit',
                    name: 'submit',
                    text: 'Submit',
                  },
                ],
                onSubmit: (api) => {
                  const col = Number(api.getData().col) || 1;
                  const row = Number(api.getData().row) || 1;
                  const onlyImage = api.getData().onlyImage;
                  const colWidth = 330;
                  const imgSize = 300;
                  const table = `<table style="width: ${colWidth * col}px;">
    <colgroup>
    ${Array.from({ length: col })
      .map(() => `<col style="width: ${colWidth}px;">`)
      .join('')}
    </colgroup>
    <tbody>
    ${Array.from({ length: row })
      .map(
        () => `<tr>
    ${Array.from({ length: col })
      .map(
        () => `<td style="text-align: center; vertical-align: middle;"><img
            src="https://watchlab-s3.s3.us-east-1.amazonaws.com/post/feceef8f-4956-4ede-bd86-0544a0bf4709.png"
            width="${imgSize}px" alt="gallery card image"></td>`
      )
      .join('')}
    </tr>
    <tr>
    ${
      onlyImage
        ? ''
        : Array.from({ length: col })
            .map(
              () => `<td style="vertical-align: top;"><h2 style="text-align: center;">Title</h2><p>This is description. This
            is description. This is description. This is description. This is description. This is description. This is
            description. This is description. This is description. This is description. This is description. This is
            description. This is description.</p></td>`
            )
            .join('')
    }
    </tr>`
      )
      .join('')}
    </tbody>
</table>`;
                  editor.setContent(table);
                  api.close();
                },
              });
            },
          });
        },
        content_css: '/editor.css',
        plugins:
          'importcss searchreplace autolink save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons preview',

        editimage_cors_hosts: ['picsum.photos'],
        menubar: 'file edit view insert format tools table help',
        toolbar:
          'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | lineheight | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen preview save print | table image media template link anchor | ltr rtl | add_graph  add_gallery add_template',
        toolbar_sticky: true,
        table_sizing_mode: 'fixed',
        image_advtab: true,
        link_list: [
          { title: 'My page 1', value: 'https://www.tiny.cloud' },
          { title: 'My page 2', value: 'http://www.moxiecode.com' },
        ],
        image_list: [
          {
            title: 'My page 1',
            value:
              'https://watchlab-s3.s3.us-east-1.amazonaws.com/gallery/b2be1b85-c882-49ab-a4e6-d20b9357d569.jpeg',
          },
          { title: 'My page 2', value: 'http://www.moxiecode.com' },
        ],
        image_class_list: [
          { title: 'None', value: '' },
          { title: 'Some class', value: 'class-name' },
        ],
        importcss_append: true,
        file_picker_callback: (callback, value, meta) => {
          /* Provide file and text for the link dialog */
          if (meta.filetype === 'file') {
            callback('https://www.google.com/logos/google.jpg', {
              text: 'My text',
            });
          }

          /* Provide image and alt text for the image dialog */
          if (meta.filetype === 'image') {
            callback('https://www.google.com/logos/google.jpg', {
              alt: 'My alt text',
            });
          }

          /* Provide alternative source and posted for the media dialog */
          if (meta.filetype === 'media') {
            callback('movie.mp4', {
              source2: 'alt.ogg',
              poster: 'https://www.google.com/logos/google.jpg',
            });
          }
        },
        template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        table_default_styles: {
          width: '1200px',
        },
        height: '100%',
        width: '1520px',
        image_caption: true,
        media_caption: true,
        quickbars_selection_toolbar:
          'bold italic | quicklink h2 h3 blockquote quickimage quicktable',
        noneditable_class: 'mceNonEditable',
        toolbar_mode: 'sliding',
        contextmenu: 'link image table',
        content_style:
          'body { font-family:Helvetica,Arial,sans-serif; font-size:16px }',
        images_upload_handler: (blobInfo) =>
          new Promise((resolve, reject) => {
            uploadS3(blobInfo.blob(), 'post')
              .then((response) => {
                resolve(response);
              })
              .catch((error) => {
                reject(error);
              });
          }),
      }}
    />
  );
};

export default PostEditor;
