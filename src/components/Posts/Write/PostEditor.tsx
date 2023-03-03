import dynamic from 'next/dynamic';
import * as process from 'process';
import { MutableRefObject } from 'react';
import { Editor as TinyMCEEditor } from 'tinymce';

import _axios from '@/lib/axiosInstance';

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
  setContentEmpty: (isEmpty: boolean) => void;
  setModalOpened: (opened: boolean) => void;
}

const PostEditor = ({
  editorRef,
  uploadGraph,
  setContentEmpty,
  setModalOpened,
}: Props) => {
  return (
    <Editor
      tinymceScriptSrc={'/tinymce/tinymce.min.js'}
      onInit={(evt, editor) => {
        editorRef.current = editor;

        uploadGraph.current = async (src: string) => {
          const img = `<img src="${src}" alt="graph">`;
          editor.insertContent(img);
        };
      }}
      onFocusOut={() => {
        if (editorRef.current) {
          setContentEmpty(editorRef.current.getContent() === '');
        }
      }}
      init={{
        setup: function (editor) {
          editor.ui.registry.addButton('custom_button', {
            text: 'Add Graph',
            onAction: function () {
              setModalOpened(true);
            },
          });
        },
        plugins:
          'preview importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap pagebreak nonbreaking anchor insertdatetime advlist lists wordcount help charmap quickbars emoticons',
        editimage_cors_hosts: ['picsum.photos'],
        menubar: 'file edit view insert format tools table help',
        toolbar:
          'undo redo | bold italic underline strikethrough | fontfamily fontsize blocks | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | image media template link anchor | ltr rtl | custom_button',
        toolbar_sticky: true,
        autosave_ask_before_unload: true,
        autosave_interval: '30s',
        autosave_prefix: '{path}{query}-{id}-',
        autosave_restore_when_empty: false,
        autosave_retention: '2m',
        image_advtab: true,
        link_list: [
          { title: 'My page 1', value: 'https://www.tiny.cloud' },
          { title: 'My page 2', value: 'http://www.moxiecode.com' },
        ],
        image_list: [
          { title: 'My page 1', value: 'https://www.tiny.cloud' },
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
        templates: [
          {
            title: 'New Table',
            description: 'creates a new table',
            content:
              '<div class="mceTmpl"><table width="98%%"  border="0" cellspacing="0" cellpadding="0"><tr><th scope="col"> </th><th scope="col"> </th></tr><tr><td> </td><td> </td></tr></table></div>',
          },
          {
            title: 'Starting my story',
            description: 'A cure for writers block',
            content: 'Once upon a time...',
          },
          {
            title: 'New list with dates',
            description: 'New List with dates',
            content:
              '<div class="mceTmpl"><span class="cdate">cdate</span><br><span class="mdate">mdate</span><h2>My List</h2><ul><li></li><li></li></ul></div>',
          },
        ],
        template_cdate_format: '[Date Created (CDATE): %m/%d/%Y : %H:%M:%S]',
        template_mdate_format: '[Date Modified (MDATE): %m/%d/%Y : %H:%M:%S]',
        height: '100%',
        width: '100%',
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
            const formData = new FormData();
            formData.append('file', blobInfo.blob());
            formData.append('path', 'post');
            _axios
              .post(
                `${process.env.NEXT_PUBLIC_SERVER_URL}/s3/upload`,
                formData,
                {
                  headers: {
                    'Content-Type': 'multipart/form-data',
                  },
                }
              )
              .then((response) => {
                resolve(response.data);
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
