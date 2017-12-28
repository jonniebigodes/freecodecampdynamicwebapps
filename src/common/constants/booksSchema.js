import {schema} from 'normalizr';

const bookCreator= new schema.Entity('bookowner');

const bookInformation= new schema.Entity('books',{
    owner:bookCreator
},{idAttribute:'booktoken'});

const dataBooks= new schema.Array(bookInformation);
export const BooksSchema= {
    dataBooks,
    bookInformation
};