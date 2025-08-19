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
    Filter,
    SelectInput,
    ReferenceField,
    ReferenceInput
} from 'react-admin';

const BatteryFilter = (props) => (
    <Filter {...props}>
        <TextInput label="Поиск" source="q" alwaysOn />
        <SelectInput source="status" choices={[
            { id: 'available', name: 'Доступна' },
            { id: 'in_use', name: 'Используется' },
            { id: 'charging', name: 'Заряжается' },
            { id: 'maintenance', name: 'Обслуживание' },
            { id: 'damaged', name: 'Повреждена' }
        ]} />
        <ReferenceInput source="station_id" reference="stations">
            <SelectInput optionText="name" />
        </ReferenceInput>
    </Filter>
);

export const BatteryList = (props) => (
    <List {...props} filters={<BatteryFilter />}>
        <Datagrid rowClick="show">
            <TextField source="id" label="ID" />
            <TextField source="serial_number" label="Серийный номер" />
            <NumberField source="charge_level" label="Заряд (%)" />
            <TextField source="status" label="Статус" />
            <ReferenceField source="station_id" reference="stations" label="Станция">
                <TextField source="name" />
            </ReferenceField>
            <DateField source="last_maintenance" label="Последнее ТО" />
            <DateField source="created_at" label="Создана" />
        </Datagrid>
    </List>
);

export const BatteryShow = (props) => (
    <Show {...props}>
        <SimpleShowLayout>
            <TextField source="id" label="ID" />
            <TextField source="serial_number" label="Серийный номер" />
            <NumberField source="charge_level" label="Заряд (%)" />
            <TextField source="status" label="Статус" />
            <ReferenceField source="station_id" reference="stations" label="Станция">
                <TextField source="name" />
            </ReferenceField>
            <NumberField source="cycle_count" label="Циклы зарядки" />
            <DateField source="last_maintenance" label="Последнее ТО" />
            <DateField source="created_at" label="Создана" />
            <DateField source="updated_at" label="Обновлена" />
        </SimpleShowLayout>
    </Show>
);

export const BatteryEdit = (props) => (
    <Edit {...props}>
        <SimpleForm>
            <TextInput source="serial_number" label="Серийный номер" />
            <NumberInput source="charge_level" label="Заряд (%)" min={0} max={100} />
            <SelectInput source="status" label="Статус" choices={[
                { id: 'available', name: 'Доступна' },
                { id: 'in_use', name: 'Используется' },
                { id: 'charging', name: 'Заряжается' },
                { id: 'maintenance', name: 'Обслуживание' },
                { id: 'damaged', name: 'Повреждена' }
            ]} />
            <ReferenceInput source="station_id" reference="stations" label="Станция">
                <SelectInput optionText="name" />
            </ReferenceInput>
            <NumberInput source="cycle_count" label="Циклы зарядки" />
        </SimpleForm>
    </Edit>
);

export const BatteryCreate = (props) => (
    <Create {...props}>
        <SimpleForm>
            <TextInput source="serial_number" label="Серийный номер" required />
            <NumberInput source="charge_level" label="Заряд (%)" defaultValue={100} min={0} max={100} />
            <SelectInput source="status" label="Статус" defaultValue="available" choices={[
                { id: 'available', name: 'Доступна' },
                { id: 'in_use', name: 'Используется' },
                { id: 'charging', name: 'Заряжается' },
                { id: 'maintenance', name: 'Обслуживание' },
                { id: 'damaged', name: 'Повреждена' }
            ]} />
            <ReferenceInput source="station_id" reference="stations" label="Станция">
                <SelectInput optionText="name" />
            </ReferenceInput>
        </SimpleForm>
    </Create>
);