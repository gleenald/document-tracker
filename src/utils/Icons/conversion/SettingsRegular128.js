import * as React from 'react';
import Svg, {Path} from 'react-native-svg';

function SettingIcon(props) {    
  return (
    <Svg
      xmlns="http://www.w3.org/2000/svg"
      {...props}>
      <Path
        d="M51.552 10.667l-2.615 13.458c-4.395 1.658-8.432 3.981-11.968 6.886l-12.927-4.459-12.459 21.563 10.354 9c-.398 2.444-.604 4.708-.604 6.885 0 2.18.213 4.44.604 6.885v.01l-10.354 9 12.459 21.553L36.958 97c3.537 2.906 7.583 5.216 11.98 6.875l2.614 13.458h24.896l2.614-13.458c4.399-1.659 8.43-3.978 11.97-6.885l12.926 4.458 12.448-21.552-10.344-9.01c.398-2.444.605-4.71.605-6.886 0-2.173-.208-4.435-.605-6.875v-.01l10.355-9.01-12.459-21.553L91.042 31c-3.538-2.906-7.583-5.216-11.98-6.875l-2.614-13.458H51.552zm8.792 10.666h7.312L69.73 32l5.563 2.104c3.352 1.264 6.365 2.999 8.979 5.146l4.604 3.77 10.25-3.52 3.656 6.323-8.187 7.125.937 5.865v.01c.326 2 .469 3.677.469 5.177 0 1.5-.143 3.177-.469 5.177l-.948 5.865 8.188 7.125-3.656 6.333-10.24-3.531-4.615 3.781c-2.614 2.147-5.616 3.882-8.968 5.146h-.01L69.718 96l-2.073 10.667h-7.302L58.27 96l-5.563-2.104c-3.353-1.264-6.365-2.999-8.979-5.146l-4.604-3.77-10.25 3.52-3.656-6.323 8.198-7.135-.948-5.844v-.01c-.322-2.009-.47-3.691-.47-5.188 0-1.5.143-3.177.47-5.177l.948-5.865-8.198-7.125 3.656-6.333 10.25 3.531 4.604-3.78c2.614-2.148 5.626-3.883 8.98-5.147L58.27 32l2.073-10.667zM64 42.667c-11.715 0-21.333 9.618-21.333 21.333 0 11.715 9.618 21.333 21.333 21.333 11.715 0 21.333-9.618 21.333-21.333 0-11.715-9.618-21.333-21.333-21.333zm0 10.666A10.62 10.62 0 0174.667 64 10.62 10.62 0 0164 74.667 10.62 10.62 0 0153.333 64 10.62 10.62 0 0164 53.333z"
      />
    </Svg>
  );
}

export default SettingIcon;