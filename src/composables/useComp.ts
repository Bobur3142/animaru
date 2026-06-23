import { useQuasar } from "quasar";
import { push } from "notivue";
import {useI18n} from "vue-i18n";
import { i18n } from "src/boot/i18n"
import { Notify } from 'quasar'

function formatPrice(value: number): string {
  const val = (value / 1).toFixed(0).replace(".", ",");
  return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function formatNumber(value: number | string, fractionDigits?: number): string {
  const num = Number(value);
  if (isNaN(num)) return "0";

  const formatted = fractionDigits === undefined ? Math.trunc(num).toString() : num.toFixed(fractionDigits);

  const [integer, decimal] = formatted.split(".");

  const integerWithSpaces = integer.replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  return decimal ? `${integerWithSpaces}.${decimal}` : integerWithSpaces;
}

function formatPhone(phone: string): string {
  let retVal;
  if (phone) {
    if (phone.length === 9) {
      retVal = `(${phone.substring(0, 2)}) ${phone.substring(2, 5)}-${phone.substring(5, 7)}-${phone.substring(7, 9)}`;
    } else {
      const result = phone.slice(-9);
      retVal = `(${result.substring(0, 2)}) ${result.substring(2, 5)}-${result.substring(5, 7)}-${result.substring(7, 9)}`;
    }
  } else {
    retVal = "";
  }
  return retVal;
}
function formatDate(dateString: number | string | null) {
  if (!dateString) return '-'
  const date = new Date(dateString)
  return date.toLocaleDateString('ru-RU')
}

function formatTimeDate(dateValue: number | string | null) {
  if (!dateValue) return ''

  const date = new Date(dateValue)

  const day = String(date.getDate()).padStart(2, '0')
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const year = date.getFullYear()

  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const second = String(date.getSeconds()).padStart(2, '0')

  return `${day}.${month}.${year} ${hours}:${minutes}:${second}`
}

function tableFilterQuery(filter: {[key: string]: any}, is_not_pagination?: number) {
  if (!filter) return "?";
  let queryArray: any[] = [];
  Object.keys(filter).map((objectKey, index) => {
    let value = filter[objectKey];
    if (value === undefined || value === null || value.length === 0) return;
    else
      queryArray.push(objectKey + "=" + value);
  });
  if (queryArray.length !== 0) return (is_not_pagination ? "?" : "?") + queryArray.join("&");
  else return "?";
}

function parsePaginationQuery(pagination: {[key: string]: string | number}) {
  const queryArray = [];

  if (!pagination) {
    return "";
  }
  if (pagination.sortBy) {
    queryArray.push("sortBy=" + pagination.sortBy);
  }
  if (pagination.descending !== undefined)
    queryArray.push("descending=" + pagination.descending);

  if (pagination.page) queryArray.push("page=" + pagination.page);
  if (pagination.rowsPerPage)
    queryArray.push("perPage=" + pagination.rowsPerPage);
  if (pagination.branches_id)
    queryArray.push("branches_id=" + pagination.branches_id);

  if (queryArray.length !== 0) return ";" + queryArray.join(";");
  else return "";
}

function returnFormatTime(milliseconds, hour) {
  let p = Math.floor(milliseconds / 1000);
  let kun, soat, minut, sekunt;
  kun = Math.floor(p / (hour * 3600));
  p = p % (hour * 3600);
  soat = Math.floor(p / 3600);
  p = p % 3600;
  minut = Math.floor(p / 60);
  p = p % 60;
  sekunt = Math.floor(p);

  let date = [
    soat.toString().padStart(2, "0"),
    minut.toString().padStart(2, "0"),
    sekunt.toString().padStart(2, "0"),
  ].join(":");

  if (kun > 0) {
    return `${kun} kun ${date}`;
  }

  return date;
}

function retTextByLocale(obj: {[key: string]: string | number | null | undefined} | undefined, fieldName: string): string | number | null | undefined {
  const locale = useI18n().locale
  if (obj) return obj[`${fieldName}_${locale.value}`] || obj[fieldName]
  else return ""
}

function showError(error: {errorMessage: string, errorCode?: number, errorDescription?: string}) {
  if (!error.errorMessage) return;

  push.error({
    title: error.errorMessage,
    message: error.errorDescription || '',
  })
}

function showInfo(message: string) {
  push.success({title: message || '',})
}

function sendDateFormat(date){
  if (!date) return;

  const [day, month, year] = date.split('.')
  return new Date(year,month - 1, day).getTime()
}

function ask(title, message, callback) {
  Notify.create({
    caption: title,
    message: message,
    timeout: 0,
    icon: 'mdi-comment-question-outline',
    color: 'white',
    classes: 'text-black text-[16px] rounded-lg shadow min-w-[320px]',
    position: 'center',
    actions: [
      { label: i18n.global.t('system.no'), flat: true, noCaps: true, class: 'py-1 px-4 rounded-lg text-slate-700 mr-2' },
      { label: i18n.global.t('system.yes'), flat: true, noCaps: true, class: 'py-1 px-4 rounded-lg bg-slate-700 text-white', handler: callback },
    ]
  })
}

export const useComp = () => {
  return {
    formatPrice,
    formatNumber,
    formatPhone,
    formatDate,
    formatTimeDate,
    tableFilterQuery,
    parsePaginationQuery,
    returnFormatTime,
    retTextByLocale,
    showError,
    showInfo,
    ask,
    sendDateFormat,
  };
};
