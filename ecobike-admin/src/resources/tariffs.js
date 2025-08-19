import React from 'react';
import {
    List,
    Datagrid,
    TextField,
    NumberField,
    DateField,
    BooleanField,
    Show,
    SimpleShowLayout,
    Edit,
    SimpleForm,
    TextInput,
    NumberInput,
    BooleanInput,
    Create,
    Filter
} from 'react-admin';

const TariffFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Поиск" source="q" alwaysOn />
        <BooleanInput source="is_active" label="Активный" />
    </Filter>
);

export const TariffList = (props) => (
    <List {...props} filters={<TariffFilter />}>
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <TextField source="name" label="Название" />
            <TextField source="description" label="Описание" />
            <NumberField source="price" label="Цена (тенге)" />
            <NumberField source="duration_days" label="Длительность (дни)" />
            <BooleanField source="is_active" label="Активный" />
            <DateField source="created_at" label="Создан" />
        </Datagrid>
    </List>
);

export const TariffShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="name" label="Название" />
            <TextField source="description" label="Описание" />
            <NumberField source="price" label="Цена (тенге)" />
            <NumberField source="duration_days" label="Длительность (дни)" />
            <NumberField source="max_exchanges_per_day" label="Макс. обменов в день" />
            <BooleanField source="is_active" label="Активный" />
            <DateField source="created_at" label="Создан" />
            <DateField source="updated_at" label="Обновлен" />
        </SimpleShowLayout>
    </Show>
);

export const TariffEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="name" label="Название" required />
            <TextInput source="description" label="Описание" multiline />
            <NumberInput source="price" label="Цена (тенге)" required />
            <NumberInput source="duration_days" label="Длительность (дни)" required />
            <NumberInput source="max_exchanges_per_day" label="Макс. обменов в день" />
            <BooleanInput source="is_active" label="Активный" />
        </SimpleForm>
    </Edit>
);

export const TariffCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="name" label="Название" required />
            <TextInput source="description" label="Описание" multiline />
            <NumberInput source="price" label="Цена (тенге)" required />
            <NumberInput source="duration_days" label="Длительность (дни)" required />
            <NumberInput source="max_exchanges_per_day" label="Макс. обменов в день" defaultValue={10} />
            <BooleanInput source="is_active" label="Активный" defaultValue={true} />
        </SimpleForm>
    </Create>
);