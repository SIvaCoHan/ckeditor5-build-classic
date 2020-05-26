/**
 * @license Copyright (c) 2003-2019, CKSource - Frederico Knabben. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */

// The editor creator to use.
import ClassicEditorBase from '@ckeditor/ckeditor5-editor-classic/src/classiceditor';

import Essentials from '@ckeditor/ckeditor5-essentials/src/essentials';
import UploadAdapter from '@ckeditor/ckeditor5-adapter-ckfinder/src/uploadadapter';
import Autoformat from '@ckeditor/ckeditor5-autoformat/src/autoformat';
import Bold from '@ckeditor/ckeditor5-basic-styles/src/bold';
import Italic from '@ckeditor/ckeditor5-basic-styles/src/italic';
import UnderLine from '@ckeditor/ckeditor5-basic-styles/src/underline';
import StrikeThrough from '@ckeditor/ckeditor5-basic-styles/src/strikethrough';
import BlockQuote from '@ckeditor/ckeditor5-block-quote/src/blockquote';
import CKFinder from '@ckeditor/ckeditor5-ckfinder/src/ckfinder';
import EasyImage from '@ckeditor/ckeditor5-easy-image/src/easyimage';
import Heading from '@ckeditor/ckeditor5-heading/src/heading';
import Image from '@ckeditor/ckeditor5-image/src/image';
import ImageCaption from '@ckeditor/ckeditor5-image/src/imagecaption';
import ImageStyle from '@ckeditor/ckeditor5-image/src/imagestyle';
import ImageToolbar from '@ckeditor/ckeditor5-image/src/imagetoolbar';
import ImageUpload from '@ckeditor/ckeditor5-image/src/imageupload';
import ImageResize from '@ckeditor/ckeditor5-image/src/imageresize';
import Indent from '@ckeditor/ckeditor5-indent/src/indent';
import Link from '@ckeditor/ckeditor5-link/src/link';
import List from '@ckeditor/ckeditor5-list/src/list';
import MediaEmbed from '@ckeditor/ckeditor5-media-embed/src/mediaembed';
import Paragraph from '@ckeditor/ckeditor5-paragraph/src/paragraph';
import PasteFromOffice from '@ckeditor/ckeditor5-paste-from-office/src/pastefromoffice';
import Table from '@ckeditor/ckeditor5-table/src/table';
import TableToolbar from '@ckeditor/ckeditor5-table/src/tabletoolbar';
import Highlight from '@ckeditor/ckeditor5-highlight/src/highlight';
import RemoveFormat from '@ckeditor/ckeditor5-remove-format/src/removeformat';
import CatchRemoteImage from './CatchRemoteImage';

class MyEditor extends ClassicEditorBase {}

// Plugins to include in the build.
MyEditor.builtinPlugins = [
	Essentials,
	UploadAdapter,
	Autoformat,
	Bold,
	Italic,
	UnderLine,
	StrikeThrough,
	BlockQuote,
	CKFinder,
	EasyImage,
	Heading,
	Image,
	ImageCaption,
	ImageStyle,
	ImageToolbar,
	ImageUpload,
	ImageResize,
	Indent,
	Link,
	List,
	MediaEmbed,
	Paragraph,
	PasteFromOffice,
	Table,
	TableToolbar,
	Highlight,
	RemoveFormat
];

// Editor configuration.
MyEditor.defaultConfig = {
	toolbar: {
		items: [
			'heading',
			'|',
			'bold',
			'italic',
			'underline',
			'strikethrough',
			'link',
			'bulletedList',
			'numberedList',
			'|',
			'indent',
			'outdent',
			'|',
			'highlight',
			'imageUpload',
			'blockQuote',
			'insertTable',
			'mediaEmbed',
			'removeFormat',
			'undo',
			'redo'
		]
	},
	image: {
		toolbar: [
			'imageStyle:full',
			'imageStyle:alignLeft',
			'imageStyle:alignRight',
			'|',
			'imageTextAlternative'
		]
	},
	table: {
		contentToolbar: [
			'tableColumn',
			'tableRow',
			'mergeTableCells'
		]
	},
	// This value must be kept in sync with the language defined in webpack.config.js.
	language: 'en'
};

export default class ClassicEditor {
	static create( element, config ) {
		console.log( 'MyEditor Created!' );
		let ret = MyEditor
			.create( element, config )
			.then( editor => {
				console.log( 'MyEditor Configured!' );
				const doc = editor.model.document;

				// 远程图片上传
				// 参考 https://github.com/ckeditor/ckeditor5-image/blob/master/src/imageupload/imageuploadediting.js#L78
				editor.model.document.on( 'change', () => {
					const changes = doc.differ.getChanges();

					for ( const entry of changes ) {
						if ( entry.type === 'insert' && entry.name === 'image' ) {
							const item = entry.position.nodeAfter;

							// Check if the image element still has upload id.
							const uploadId = item.getAttribute( 'uploadId' );
							const uploadStatus = item.getAttribute( 'uploadStatus' );

							if ( !uploadId && !uploadStatus ) {
								// eslint-disable-next-line new-cap
								console.log('catch images', item);
								CatchRemoteImage( editor, item );
							}
						}
					}
				} );
				return editor;
			} );
		console.log('editor config finished');

		return ret;
	}
};
