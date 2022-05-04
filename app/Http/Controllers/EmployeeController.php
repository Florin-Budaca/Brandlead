<?php

namespace App\Http\Controllers;

use App\Http\Requests\EmployeeStoreRequest;
use App\Models\Employee;
use Illuminate\Http\JsonResponse;

class EmployeeController extends Controller
{
    /**
     * Returns the employees positioned by position.
     *
     * @return JsonResponse
     */
    public function index(): JsonResponse
    {
        $employees = Employee::query()
            ->orderBy('position')
            ->get();

        return response()->json($employees);
    }

    /**
     * Creates a new employee.
     * @param EmployeeStoreRequest $request
     * @param Employee $employee
     * @return JsonResponse
     */
    public function store(EmployeeStoreRequest $request): JsonResponse
    {
        $existing_employee = Employee::query()
            ->withTrashed()
            ->where('name', $request->input('name'))
            ->first();

        if (!empty($existing_employee->deleted_at)) {
            $existing_employee->restore();
            $existing_employee->position = Employee::max('position') + 1;
            $existing_employee->save();

            return response()->json($existing_employee);
        }

        if ($existing_employee) {
            return response()->json('Employee already exists', 422);
        }

        $employee = new Employee();
        $employee->name = $request->input('name');
        $employee->position = Employee::max('position') + 1;
        $employee->save();

        return response()->json($employee);
    }

    /**
     * Updates a employee.
     *
     * @param EmployeeStoreRequest $request
     * @param Employee $employee
     * @return JsonResponse
     */
    public function update(EmployeeStoreRequest $request, Employee $employee): JsonResponse
    {
        $employee->update($request->validated());

        return response()->json($employee);
    }

    /**
     * Deletes a employee.
     *
     * @param Employee $employee
     * @return JsonResponse
     */
    public function destroy(Employee $employee): JsonResponse
    {
        $employee->delete();

        return response()->json(null);
    }

    /**
     * Moves a employee up or down.
     *
     * @return JsonResponse
     */
    public function positionUp(Employee $employee): JsonResponse
    {
        $current_position = $employee->position;

        $previous_employee = Employee::query()
            ->where('position', '<', $current_position)
            ->orderBy('position', 'desc')
            ->first();

        if ($previous_employee) {
            $employee->position = $previous_employee->position;
            $employee->save();

            $previous_employee->position = $current_position;
            $previous_employee->save();
        } else {
            $employee->position = 1;
            $employee->save();
        }

        return response()->json($employee);
    }

    /**
     * Moves a employee up or down.
     *
     * @return JsonResponse
     */
    public function positionDown(Employee $employee): JsonResponse
    {
        $current_position = $employee->position;

        $next_employee = Employee::query()
            ->where('position', '>', $current_position)
            ->orderBy('position')
            ->first();

        if ($next_employee) {
            $employee->position = $next_employee->position;
            $employee->save();

            $next_employee->position = $current_position;
            $next_employee->save();
        } else {
            $employee->position = Employee::max('position') + 1;
            $employee->save();
        }

        return response()->json($employee);
    }
}
